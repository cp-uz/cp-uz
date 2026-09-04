from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import GuestSession
from apps.articles.models import Article, Category
from apps.engagement.models import Bookmark, GlossaryQuizScore, PersonalNote, ReadingProgress


class AuthenticationTests(TestCase):
    def test_jwt_and_current_profile(self):
        User = get_user_model()
        user = User.objects.create_user(
            username="ali", password="very-strong-pass", display_name="Ali"
        )
        client = APIClient()
        token = client.post(
            "/api/v1/auth/login/",
            {"username": "ali", "password": "very-strong-pass"},
            format="json",
        )
        self.assertEqual(token.status_code, 200)
        self.assertIn("access", token.data)
        self.assertEqual(token.data["user"]["name"], "Ali")

        client.credentials(HTTP_AUTHORIZATION=f"Bearer {token.data['access']}")
        profile = client.get("/api/v1/accounts/me/")
        self.assertEqual(profile.status_code, 200)
        self.assertEqual(profile.data["id"], user.id)
        self.assertFalse(profile.data["is_guest"])


class GuestSessionTests(TestCase):
    def setUp(self):
        cache.clear()
        category = Category.objects.create(name="Graf", slug="graph-guest-test")
        self.article = Article.objects.create(
            title="Guest uchun BFS",
            slug="guest-test--bfs",
            canonical_path="guest-test/bfs",
            summary="Guest saqlashi mumkin bo‘lgan maqola",
            content="# BFS",
            category=category,
            visibility=Article.Visibility.PUBLIC,
        )

    def test_guest_identity_is_unique_resumable_and_persists_engagement(self):
        anonymous = APIClient()
        created = anonymous.post("/api/v1/auth/guest/", {}, format="json")
        self.assertEqual(created.status_code, 201)
        self.assertTrue(created.data["created"])
        self.assertTrue(created.data["user"]["is_guest"])
        self.assertNotIn("password", created.data)

        guest_user_id = created.data["user"]["id"]
        credential = created.data["session_token"]
        guest_client = APIClient()
        guest_client.credentials(HTTP_AUTHORIZATION=f"Bearer {created.data['access']}")
        bookmarked = guest_client.post(
            "/api/v1/me/bookmarks/",
            {"article_slug": self.article.slug},
            format="json",
        )
        self.assertEqual(bookmarked.status_code, 201)

        resumed = anonymous.post(
            "/api/v1/auth/guest/", {"session_token": credential}, format="json"
        )
        self.assertEqual(resumed.status_code, 200)
        self.assertFalse(resumed.data["created"])
        self.assertEqual(resumed.data["user"]["id"], guest_user_id)

        resumed_client = APIClient()
        resumed_client.credentials(HTTP_AUTHORIZATION=f"Bearer {resumed.data['access']}")
        bookmarks = resumed_client.get("/api/v1/me/bookmarks/")
        self.assertEqual(bookmarks.status_code, 200)
        self.assertEqual(bookmarks.data["count"], 1)
        self.assertEqual(Bookmark.objects.filter(user_id=guest_user_id).count(), 1)

        separate = anonymous.post("/api/v1/auth/guest/", {}, format="json")
        self.assertEqual(separate.status_code, 201)
        self.assertNotEqual(separate.data["user"]["id"], guest_user_id)
        self.assertEqual(GuestSession.objects.count(), 2)

    def test_invalid_guest_token_never_silently_creates_new_identity(self):
        response = APIClient().post(
            "/api/v1/auth/guest/",
            {"session_token": "00000000-0000-0000-0000-000000000000.invalid"},
            format="json",
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(GuestSession.objects.count(), 0)

    def test_guest_upgrade_preserves_identity_and_engagement(self):
        anonymous = APIClient()
        created = anonymous.post("/api/v1/auth/guest/", {}, format="json")
        self.assertEqual(created.status_code, 201)
        user_id = created.data["user"]["id"]
        guest_credential = created.data["session_token"]

        Bookmark.objects.create(user_id=user_id, article=self.article)
        ReadingProgress.objects.create(
            user_id=user_id,
            article=self.article,
            percent=65,
            status=ReadingProgress.Status.IN_PROGRESS,
        )
        PersonalNote.objects.create(
            user_id=user_id,
            article=self.article,
            body="BFS navbat bilan ishlaydi.",
        )
        GlossaryQuizScore.objects.create(
            user_id=user_id,
            correct_answers=18,
            total_answers=25,
            current_streak=3,
            best_streak=7,
        )

        guest_client = APIClient()
        guest_client.credentials(HTTP_AUTHORIZATION=f"Bearer {created.data['access']}")
        upgraded = guest_client.post(
            "/api/v1/auth/guest/upgrade/",
            {
                "username": "Saved_Learner",
                "first_name": "  Diyor  ",
                "last_name": "  Karimov  ",
            },
            format="json",
        )

        self.assertEqual(upgraded.status_code, 200)
        self.assertEqual(upgraded.data["username"], "saved_learner")
        self.assertEqual(upgraded.data["user"]["id"], user_id)
        self.assertEqual(upgraded.data["user"]["first_name"], "Diyor")
        self.assertEqual(upgraded.data["user"]["last_name"], "Karimov")
        self.assertEqual(upgraded.data["user"]["name"], "Diyor Karimov")
        self.assertFalse(upgraded.data["user"]["is_guest"])
        self.assertIn("access", upgraded.data)
        self.assertIn("refresh", upgraded.data)
        self.assertNotIn("session_token", upgraded.data)

        one_time_password = upgraded.data["one_time_password"]
        self.assertGreaterEqual(len(one_time_password), 20)
        User = get_user_model()
        user = User.objects.get(pk=user_id)
        self.assertEqual(user.username, "saved_learner")
        self.assertEqual(user.first_name, "Diyor")
        self.assertEqual(user.last_name, "Karimov")
        self.assertTrue(user.check_password(one_time_password))
        self.assertFalse(user.is_guest)
        self.assertFalse(GuestSession.objects.filter(user_id=user_id).exists())
        self.assertEqual(Bookmark.objects.filter(user_id=user_id).count(), 1)
        self.assertEqual(ReadingProgress.objects.filter(user_id=user_id, percent=65).count(), 1)
        self.assertEqual(PersonalNote.objects.filter(user_id=user_id).count(), 1)
        self.assertEqual(
            GlossaryQuizScore.objects.filter(
                user_id=user_id,
                correct_answers=18,
                total_answers=25,
                current_streak=3,
                best_streak=7,
            ).count(),
            1,
        )

        old_guest = anonymous.post(
            "/api/v1/auth/guest/",
            {"session_token": guest_credential},
            format="json",
        )
        self.assertEqual(old_guest.status_code, 401)

        login = anonymous.post(
            "/api/v1/auth/login/",
            {"username": "saved_learner", "password": one_time_password},
            format="json",
        )
        self.assertEqual(login.status_code, 200)
        self.assertEqual(login.data["user"]["id"], user_id)

        real_client = APIClient()
        real_client.credentials(HTTP_AUTHORIZATION=f"Bearer {upgraded.data['access']}")
        repeated = real_client.post(
            "/api/v1/auth/guest/upgrade/",
            {"username": "another_name"},
            format="json",
        )
        self.assertEqual(repeated.status_code, 403)
        self.assertNotIn("one_time_password", repeated.data)

    def test_guest_upgrade_optional_names_allow_blank_and_enforce_max_length(self):
        anonymous = APIClient()

        blank_guest = anonymous.post("/api/v1/auth/guest/", {}, format="json")
        blank_client = APIClient()
        blank_client.credentials(HTTP_AUTHORIZATION=f"Bearer {blank_guest.data['access']}")
        blank_response = blank_client.post(
            "/api/v1/auth/guest/upgrade/",
            {
                "username": "blank_names",
                "first_name": "   ",
                "last_name": "",
            },
            format="json",
        )
        self.assertEqual(blank_response.status_code, 200)
        blank_user = get_user_model().objects.get(pk=blank_guest.data["user"]["id"])
        self.assertEqual(blank_user.first_name, "")
        self.assertEqual(blank_user.last_name, "")
        self.assertEqual(blank_response.data["user"]["name"], "blank_names")

        omitted_guest = anonymous.post("/api/v1/auth/guest/", {}, format="json")
        omitted_client = APIClient()
        omitted_client.credentials(HTTP_AUTHORIZATION=f"Bearer {omitted_guest.data['access']}")
        omitted_response = omitted_client.post(
            "/api/v1/auth/guest/upgrade/",
            {"username": "names_omitted"},
            format="json",
        )
        self.assertEqual(omitted_response.status_code, 200)

        long_guest = anonymous.post("/api/v1/auth/guest/", {}, format="json")
        long_client = APIClient()
        long_client.credentials(HTTP_AUTHORIZATION=f"Bearer {long_guest.data['access']}")
        too_long = long_client.post(
            "/api/v1/auth/guest/upgrade/",
            {"username": "long_name", "first_name": "a" * 151},
            format="json",
        )
        self.assertEqual(too_long.status_code, 400)
        self.assertIn("first_name", too_long.data["error"]["detail"])
        self.assertTrue(GuestSession.objects.filter(user_id=long_guest.data["user"]["id"]).exists())

    def test_guest_upgrade_schema_exposes_optional_profile_names(self):
        response = APIClient().get("/api/schema/?format=json")
        self.assertEqual(response.status_code, 200)
        request_ref = response.data["paths"]["/api/v1/auth/guest/upgrade/"]["post"]["requestBody"][
            "content"
        ]["application/json"]["schema"]["$ref"]
        request_schema = response.data["components"]["schemas"][request_ref.rsplit("/", 1)[-1]]
        self.assertEqual(request_schema["properties"]["first_name"]["maxLength"], 150)
        self.assertEqual(request_schema["properties"]["last_name"]["maxLength"], 150)
        self.assertIn("username", request_schema["required"])
        self.assertNotIn("first_name", request_schema["required"])
        self.assertNotIn("last_name", request_schema["required"])

    def test_guest_upgrade_rejects_duplicate_username_without_mutation(self):
        User = get_user_model()
        User.objects.create_user(username="taken_name", password="Strong-Pass-2026!")
        created = APIClient().post("/api/v1/auth/guest/", {}, format="json")
        user_id = created.data["user"]["id"]

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {created.data['access']}")
        response = client.post(
            "/api/v1/auth/guest/upgrade/",
            {"username": "TAKEN_NAME"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("username", response.data["error"]["detail"])
        guest = User.objects.get(pk=user_id)
        self.assertTrue(guest.username.startswith("guest_"))
        self.assertFalse(guest.has_usable_password())
        self.assertTrue(GuestSession.objects.filter(user=guest).exists())

    def test_guest_upgrade_validates_username_format_and_reserved_names(self):
        created = APIClient().post("/api/v1/auth/guest/", {}, format="json")
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {created.data['access']}")

        for username in ("ab", "admin", "guest_learner", "bad name"):
            with self.subTest(username=username):
                response = client.post(
                    "/api/v1/auth/guest/upgrade/",
                    {"username": username},
                    format="json",
                )
                self.assertEqual(response.status_code, 400)
                self.assertIn("username", response.data["error"]["detail"])

        self.assertTrue(GuestSession.objects.filter(user_id=created.data["user"]["id"]).exists())

    def test_non_guest_cannot_use_guest_upgrade_endpoint(self):
        User = get_user_model()
        User.objects.create_user(username="real_user", password="Strong-Pass-2026!")
        anonymous = APIClient()
        login = anonymous.post(
            "/api/v1/auth/login/",
            {"username": "real_user", "password": "Strong-Pass-2026!"},
            format="json",
        )
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

        response = client.post(
            "/api/v1/auth/guest/upgrade/",
            {"username": "new_real_user"},
            format="json",
        )

        self.assertEqual(response.status_code, 403)
        self.assertNotIn("one_time_password", response.data)
