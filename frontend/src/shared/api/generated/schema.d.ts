// Generated from Django OpenAPI. Run npm run api:generate; do not edit by hand.
export interface paths {
  '/api/v1/accounts/me/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_accounts_me_retrieve'];
    put: operations['api_v1_accounts_me_update'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations['api_v1_accounts_me_partial_update'];
    trace?: never;
  };
  '/api/v1/articles/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_articles_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/articles/{slug}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_articles_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/articles/all/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Return the fixed, lightweight article index without a large page_size query. */
    get: operations['api_v1_articles_all_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/articles/by-path/{canonical_path}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_articles_by_path_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/auth/account/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['api_v1_auth_account_destroy'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/auth/guest/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['api_v1_auth_guest_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/auth/guest/upgrade/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['api_v1_auth_guest_upgrade_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/auth/login/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * @description Takes a set of user credentials and returns an access and refresh JSON web
     *     token pair to prove the authentication of those credentials.
     */
    post: operations['api_v1_auth_login_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/auth/token/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * @description Takes a set of user credentials and returns an access and refresh JSON web
     *     token pair to prove the authentication of those credentials.
     */
    post: operations['api_v1_auth_token_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/auth/token/refresh/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * @description Takes a refresh type JSON web token and returns an access type JSON web
     *     token if the refresh token is valid.
     */
    post: operations['api_v1_auth_token_refresh_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/categories/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_categories_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/categories/{slug}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_categories_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/contributions/proposals/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_contributions_proposals_list'];
    put?: never;
    post: operations['api_v1_contributions_proposals_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/contributions/proposals/{id}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_contributions_proposals_retrieve'];
    put: operations['api_v1_contributions_proposals_update'];
    post?: never;
    delete: operations['api_v1_contributions_proposals_destroy'];
    options?: never;
    head?: never;
    patch: operations['api_v1_contributions_proposals_partial_update'];
    trace?: never;
  };
  '/api/v1/contributions/proposals/{id}/review/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['api_v1_contributions_proposals_review_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/contributions/proposals/{id}/submit/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['api_v1_contributions_proposals_submit_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/contributions/proposals/{id}/withdraw/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['api_v1_contributions_proposals_withdraw_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/contributions/reviews/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_contributions_reviews_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/contributions/reviews/{id}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_contributions_reviews_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/feedback/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_feedback_retrieve'];
    put?: never;
    post: operations['api_v1_feedback_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/glossary/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_glossary_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/glossary/{slug}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_glossary_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/glossary/all/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Return the curated glossary in one small response for local filtering and quizzes. */
    get: operations['api_v1_glossary_all_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/glossary/leaderboard/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_glossary_leaderboard_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/glossary/questions/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['api_v1_glossary_questions_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/glossary/score/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['api_v1_glossary_score_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/me/bookmarks/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_me_bookmarks_list'];
    put?: never;
    post: operations['api_v1_me_bookmarks_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/me/bookmarks/{id}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_me_bookmarks_retrieve'];
    put?: never;
    post?: never;
    delete: operations['api_v1_me_bookmarks_destroy'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/me/bookmarks/all/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Return this user's small learning collection without oversized page parameters. */
    get: operations['api_v1_me_bookmarks_all_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/me/notes/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_me_notes_list'];
    put?: never;
    post: operations['api_v1_me_notes_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/me/notes/{id}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_me_notes_retrieve'];
    put: operations['api_v1_me_notes_update'];
    post?: never;
    delete: operations['api_v1_me_notes_destroy'];
    options?: never;
    head?: never;
    patch: operations['api_v1_me_notes_partial_update'];
    trace?: never;
  };
  '/api/v1/me/notes/all/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Return this user's small learning collection without oversized page parameters. */
    get: operations['api_v1_me_notes_all_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/me/progress/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_me_progress_list'];
    put?: never;
    post: operations['api_v1_me_progress_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/me/progress/{id}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_me_progress_retrieve'];
    put: operations['api_v1_me_progress_update'];
    post?: never;
    delete: operations['api_v1_me_progress_destroy'];
    options?: never;
    head?: never;
    patch: operations['api_v1_me_progress_partial_update'];
    trace?: never;
  };
  '/api/v1/me/progress/all/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Return this user's small learning collection without oversized page parameters. */
    get: operations['api_v1_me_progress_all_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/problems/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['problem_catalog'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/problems/{season_slug}/{event_slug}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['problem_event'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/problems/{season_slug}/{event_slug}/{problem_slug}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['problem_detail'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/problems/{season_slug}/{event_slug}/{problem_slug}/statement.pdf': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['problem_statement_pdf'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/search/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_search_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/seasons/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_seasons_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/seasons/{season_slug}/events/{event_slug}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_seasons_events_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/seasons/{season_slug}/participants/{participant_slug}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_seasons_participants_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/seasons/{slug}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_seasons_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/seasons/current/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_seasons_current_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/stats/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_stats_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/tags/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_tags_list'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/tags/{slug}/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['api_v1_tags_retrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    AccountDeleteRequest: {
      /** @description Akkauntni o‘chirishni tasdiqlash uchun aynan "O‘CHIRISH" deb yuboring. */
      confirmation: string;
      /** @description Oddiy akkaunt uchun joriy parol majburiy; mehmon akkaunti uchun yuborilmaydi. */
      password?: string;
    };
    ArticleDetail: {
      readonly asset_base_url: string;
      canonical_path?: string | null;
      readonly canonical_url: string;
      readonly category: components['schemas']['CategorySummary'];
      /** @description CommonMark/Markdown matni */
      content: string;
      readonly content_hash: string;
      content_license?: string;
      readonly contributors: components['schemas']['Contributor'][];
      /** Format: uri */
      cover_image_url?: string;
      difficulty?: components['schemas']['DifficultyEnum'];
      /** Format: int64 */
      estimated_reading_minutes?: number;
      /** Format: uuid */
      readonly id: string;
      is_featured?: boolean;
      language?: string;
      readonly next_article: components['schemas']['ArticleLink'] | null;
      readonly practice_references: components['schemas']['PracticeReference'][];
      readonly prerequisites: components['schemas']['Prerequisite'][];
      readonly previous_article: components['schemas']['ArticleLink'] | null;
      provenance?: unknown;
      /** Format: date-time */
      published_at?: string | null;
      readonly related_articles: components['schemas']['ArticleLink'][];
      readonly review_state: components['schemas']['ArticleReviewState'];
      readonly russian_source_url: string | null;
      seo_description?: string;
      seo_title?: string;
      slug: string;
      source_commit?: string;
      source_path?: string;
      /** Format: uri */
      source_repository?: string;
      /** Format: uri */
      source_url?: string;
      status?: components['schemas']['ArticleStatusEnum'];
      subtitle?: string;
      summary: string;
      readonly tags: components['schemas']['Tag'][];
      title: string;
      /** Format: date-time */
      readonly updated_at: string;
      visibility?: components['schemas']['VisibilityEnum'];
    };
    ArticleLink: {
      canonical_path?: string | null;
      readonly canonical_url: string;
      readonly category: components['schemas']['CategorySummary'];
      difficulty?: components['schemas']['DifficultyEnum'];
      /** Format: int64 */
      estimated_reading_minutes?: number;
      /** Format: uuid */
      readonly id: string;
      slug: string;
      title: string;
    };
    ArticleLinkRequest: {
      canonical_path?: string | null;
      difficulty?: components['schemas']['DifficultyEnum'];
      /** Format: int64 */
      estimated_reading_minutes?: number;
      slug: string;
      title: string;
    };
    ArticleList: {
      readonly asset_base_url: string;
      canonical_path?: string | null;
      readonly canonical_url: string;
      readonly category: components['schemas']['CategorySummary'];
      /** Format: uri */
      cover_image_url?: string;
      difficulty?: components['schemas']['DifficultyEnum'];
      /** Format: int64 */
      estimated_reading_minutes?: number;
      /** Format: uuid */
      readonly id: string;
      is_featured?: boolean;
      language?: string;
      /** Format: date-time */
      published_at?: string | null;
      slug: string;
      status?: components['schemas']['ArticleStatusEnum'];
      subtitle?: string;
      summary: string;
      readonly tags: components['schemas']['Tag'][];
      title: string;
      /** Format: date-time */
      readonly updated_at: string;
      visibility?: components['schemas']['VisibilityEnum'];
    };
    ArticleListRequest: {
      canonical_path?: string | null;
      /** Format: uri */
      cover_image_url?: string;
      difficulty?: components['schemas']['DifficultyEnum'];
      /** Format: int64 */
      estimated_reading_minutes?: number;
      is_featured?: boolean;
      language?: string;
      /** Format: date-time */
      published_at?: string | null;
      slug: string;
      status?: components['schemas']['ArticleStatusEnum'];
      subtitle?: string;
      summary: string;
      title: string;
      visibility?: components['schemas']['VisibilityEnum'];
    };
    ArticleReviewState: {
      content_hash: string;
      fully_reviewed: boolean;
      language_approved: boolean;
      latest: {
        [key: string]: components['schemas']['ReviewDecision'] | null;
      };
      technical_approved: boolean;
    };
    /**
     * @description * `draft` - Qoralama
     *     * `in_review` - Ko‘rib chiqilmoqda
     *     * `published` - Nashr qilingan
     *     * `archived` - Arxivlangan
     * @enum {string}
     */
    ArticleStatusEnum: 'draft' | 'in_review' | 'published' | 'archived';
    /** @enum {unknown} */
    BlankEnum: '';
    Bookmark: {
      readonly article: components['schemas']['ArticleList'];
      /** Format: date-time */
      readonly created_at: string;
      readonly id: number;
    };
    BookmarkRequest: {
      article_slug: string;
    };
    Category: {
      /** @default 0 */
      readonly article_count: number;
      readonly children: components['schemas']['Category'][];
      color?: string;
      description?: string;
      icon?: string;
      readonly id: number;
      name: string;
      /** Format: int64 */
      order?: number;
      readonly parent_slug: string | null;
      slug: string;
    };
    CategorySummary: {
      color?: string;
      icon?: string;
      name: string;
      slug: string;
    };
    CategorySummaryRequest: {
      color?: string;
      icon?: string;
      name: string;
      slug: string;
    };
    /**
     * @description * `blue` - Ko‘k
     *     * `red` - Qizil
     *     * `brown` - Jigarrang
     *     * `teal` - Teal
     *     * `gold` - Oltin
     *     * `purple` - Binafsha
     *     * `green` - Yashil
     *     * `neutral` - Neytral
     * @enum {string}
     */
    ColorEnum: 'blue' | 'red' | 'brown' | 'teal' | 'gold' | 'purple' | 'green' | 'neutral';
    Contributor: {
      note?: string;
      /** Format: int64 */
      order?: number;
      role: components['schemas']['ContributorRoleEnum'];
      readonly role_label: string;
      readonly user: components['schemas']['UserSummary'];
    };
    /**
     * @description * `author` - Muallif
     *     * `translator` - Tarjimon
     *     * `editor` - Muharrir
     *     * `technical_reviewer` - Texnik reviewer
     *     * `language_reviewer` - Til revieweri
     * @enum {string}
     */
    ContributorRoleEnum:
      | 'author'
      | 'translator'
      | 'editor'
      | 'technical_reviewer'
      | 'language_reviewer';
    CpuzTokenObtainPairRequest: {
      password: string;
      username: string;
    };
    /**
     * @description * `tba` - Sana noma’lum
     *     * `month` - Oy aniqligida
     *     * `day` - Kun aniqligida
     *     * `range` - Sana oralig‘i
     * @enum {string}
     */
    DatePrecisionEnum: 'tba' | 'month' | 'day' | 'range';
    /**
     * @description * `approved` - Tasdiqlandi
     *     * `changes_requested` - O‘zgartirish so‘raldi
     *     * `rejected` - Rad etildi
     * @enum {string}
     */
    DecisionEnum: 'approved' | 'changes_requested' | 'rejected';
    /**
     * @description * `pending` - Kutilmoqda
     *     * `sent` - Telegram’ga yuborildi
     *     * `failed` - Yuborilmadi
     * @enum {string}
     */
    DeliveryStatusEnum: 'pending' | 'sent' | 'failed';
    /**
     * @description * `beginner` - Boshlang‘ich
     *     * `intermediate` - O‘rta
     *     * `advanced` - Yuqori
     * @enum {string}
     */
    DifficultyEnum: 'beginner' | 'intermediate' | 'advanced';
    EditorialStats: {
      draft: number;
      in_review: number;
      published: number;
    };
    EditProposal: {
      readonly article: components['schemas']['ArticleLink'];
      readonly base_content_hash: string;
      change_summary: string;
      /** Format: date-time */
      readonly created_at: string;
      /** Format: uri */
      readonly github_pr_url: string;
      /** Format: uuid */
      readonly id: string;
      readonly is_stale: boolean;
      readonly proposal_hash: string;
      proposed_content: string;
      proposed_summary: string;
      proposed_title: string;
      /** Format: date-time */
      readonly resolved_at: string | null;
      readonly reviews: components['schemas']['ReviewRecord'][];
      readonly status: components['schemas']['ProposalStatusEnum'];
      readonly status_events: components['schemas']['StatusEvent'][];
      /** Format: date-time */
      readonly submitted_at: string | null;
      readonly submitter: components['schemas']['UserSummary'];
      /** Format: date-time */
      readonly updated_at: string;
    };
    EditProposalRequest: {
      article_slug: string;
      change_summary: string;
      proposed_content: string;
      proposed_summary: string;
      proposed_title: string;
    };
    EventDetail: {
      code: string;
      date_label?: string;
      date_precision?: components['schemas']['DatePrecisionEnum'];
      description?: string;
      eligibility?: string;
      /** Format: date */
      end_date?: string | null;
      event_status?: components['schemas']['EventStatusEnum'];
      grade_max?: number | null;
      grade_min?: number | null;
      /** Format: uuid */
      readonly id: string;
      readonly incoming_edges: components['schemas']['EventEdge'][];
      is_featured?: boolean;
      location?: string;
      mode?: components['schemas']['SeasonEventModeEnum'];
      /** Format: int64 */
      order?: number;
      organizer?: string;
      readonly outgoing_edges: components['schemas']['EventEdge'][];
      platform?: string;
      readonly resources: components['schemas']['EventResource'][];
      readonly results: components['schemas']['ResultEntry'][];
      readonly route_memberships: components['schemas']['EventRoute'][];
      readonly season: components['schemas']['SeasonLink'];
      short_title?: string;
      slug: string;
      readonly sources: components['schemas']['EventSourceDetail'][];
      /** Format: date */
      start_date?: string | null;
      summary?: string;
      timezone?: string;
      title: string;
      type: components['schemas']['SeasonEventTypeEnum'];
      venue?: string;
      verification_status?: components['schemas']['SeasonVerificationStatusEnum'];
      /** Format: date-time */
      verified_at?: string | null;
    };
    EventEdge: {
      readonly from_event_code: string;
      /** Format: uuid */
      readonly id: string;
      label?: string;
      line_style?: components['schemas']['LineStyleEnum'];
      /** Format: int64 */
      order?: number;
      relation_type: components['schemas']['RelationTypeEnum'];
      readonly route_code: string | null;
      readonly to_event_code: string;
    };
    EventGraph: {
      code: string;
      date_label?: string;
      date_precision?: components['schemas']['DatePrecisionEnum'];
      description?: string;
      eligibility?: string;
      /** Format: date */
      end_date?: string | null;
      event_status?: components['schemas']['EventStatusEnum'];
      grade_max?: number | null;
      grade_min?: number | null;
      /** Format: uuid */
      readonly id: string;
      is_featured?: boolean;
      location?: string;
      mode?: components['schemas']['SeasonEventModeEnum'];
      /** Format: int64 */
      order?: number;
      organizer?: string;
      platform?: string;
      readonly resources: components['schemas']['EventResource'][];
      readonly results: components['schemas']['ResultEntry'][];
      readonly route_memberships: components['schemas']['EventRoute'][];
      short_title?: string;
      slug: string;
      readonly sources: components['schemas']['EventSource'][];
      /** Format: date */
      start_date?: string | null;
      summary?: string;
      timezone?: string;
      title: string;
      type: components['schemas']['SeasonEventTypeEnum'];
      venue?: string;
      verification_status?: components['schemas']['SeasonVerificationStatusEnum'];
      /** Format: date-time */
      verified_at?: string | null;
    };
    EventResource: {
      readonly id: number;
      is_official?: boolean;
      /** Format: int64 */
      order?: number;
      title: string;
      type: components['schemas']['SeasonResourceTypeEnum'];
      /** Format: uri */
      url: string;
    };
    EventRoute: {
      label?: string;
      node_style?: components['schemas']['NodeStyleEnum'];
      /** Format: int64 */
      order?: number;
      readonly route_code: string;
    };
    EventSource: {
      /** Format: date */
      accessed_on?: string | null;
      readonly id: number;
      is_primary?: boolean;
      publisher?: string;
      title: string;
      type: components['schemas']['SeasonSourceTypeEnum'];
      /** Format: uri */
      url: string;
    };
    EventSourceDetail: {
      /** Format: date */
      accessed_on?: string | null;
      readonly id: number;
      is_primary?: boolean;
      notes?: string;
      publisher?: string;
      title: string;
      type: components['schemas']['SeasonSourceTypeEnum'];
      /** Format: uri */
      url: string;
    };
    /**
     * @description * `tba` - E’lon qilinadi
     *     * `scheduled` - Rejalashtirilgan
     *     * `live` - Davom etmoqda
     *     * `completed` - Yakunlangan
     *     * `postponed` - Qoldirilgan
     *     * `cancelled` - Bekor qilingan
     * @enum {string}
     */
    EventStatusEnum: 'tba' | 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';
    FeedbackSubmission: {
      contact?: string;
      /** Format: date-time */
      readonly created_at: string;
      readonly delivery_status: components['schemas']['DeliveryStatusEnum'];
      full_name: string;
      /** Format: uuid */
      readonly id: string;
      note: string;
    };
    FeedbackSubmissionRequest: {
      /** Format: binary */
      attachment?: string | null;
      contact?: string;
      full_name: string;
      note: string;
    };
    GlossaryLeaderboardEntry: {
      best_streak: number;
      correct: number;
      current_streak: number;
      is_current_user: boolean;
      name: string;
      percent: number;
      rank: number;
      total: number;
      /** Format: date-time */
      updated_at: string;
    };
    GlossaryQuizAnswerResult: {
      correct_answer: string;
      is_correct: boolean;
      /** Format: uuid */
      question_id: string;
    };
    /**
     * @description * `english_to_uzbek` - english_to_uzbek
     *     * `uzbek_to_english` - uzbek_to_english
     *     * `definition_to_english` - definition_to_english
     *     * `definition_to_uzbek` - definition_to_uzbek
     * @enum {string}
     */
    GlossaryQuizModeEnum:
      | 'english_to_uzbek'
      | 'uzbek_to_english'
      | 'definition_to_english'
      | 'definition_to_uzbek';
    GlossaryQuizQuestion: {
      /** Format: date-time */
      expires_at: string;
      /** Format: uuid */
      readonly id: string;
      instruction: string;
      readonly mode: components['schemas']['GlossaryQuizModeEnum'];
      mode_label: string;
      readonly options: string[];
      prompt: string;
    };
    GlossaryQuizScoreResponse: {
      answer: components['schemas']['GlossaryQuizAnswerResult'];
      leaderboard: components['schemas']['GlossaryLeaderboardEntry'][];
      participant_count: number;
      personal: components['schemas']['GlossaryLeaderboardEntry'] | null;
    };
    GlossaryQuizState: {
      leaderboard: components['schemas']['GlossaryLeaderboardEntry'][];
      participant_count: number;
      personal: components['schemas']['GlossaryLeaderboardEntry'] | null;
    };
    GlossaryQuizSubmissionRequest: {
      client_answer_id: string;
      /** Format: uuid */
      question_id: string;
      selected_answer: string;
    };
    GlossaryTermDetail: {
      readonly aliases: string[];
      definition: string;
      readonly description: string;
      readonly english_term: string;
      readonly id: number;
      readonly related_articles: components['schemas']['ArticleLink'][];
      short_definition: string;
      slug: string;
      term: string;
      /** Format: date-time */
      readonly updated_at: string;
      readonly uzbek_term: string;
    };
    GlossaryTermList: {
      readonly aliases: string[];
      readonly description: string;
      readonly english_term: string;
      readonly id: number;
      short_definition: string;
      slug: string;
      term: string;
      /** Format: date-time */
      readonly updated_at: string;
      readonly uzbek_term: string;
    };
    GuestAuthResponse: {
      access: string;
      created: boolean;
      refresh: string;
      session_token: string;
      user: components['schemas']['UserSummary'];
    };
    GuestSessionRequestRequest: {
      session_token?: string;
    };
    GuestUpgradeRequestRequest: {
      /** @description Ixtiyoriy ism. Bo‘sh qiymat qabul qilinadi. */
      first_name?: string;
      /** @description Ixtiyoriy familiya. Bo‘sh qiymat qabul qilinadi. */
      last_name?: string;
      username: string;
    };
    GuestUpgradeResponse: {
      access: string;
      /** @description Faqat shu javobda ko‘rsatiladigan, server yaratgan parol. */
      one_time_password: string;
      refresh: string;
      user: components['schemas']['UserSummary'];
      username: string;
    };
    /**
     * @description * `warm_up` - Qizish
     *     * `recommended` - Tavsiya etiladi
     *     * `challenge` - Murakkab sinov
     * @enum {string}
     */
    LevelEnum: 'warm_up' | 'recommended' | 'challenge';
    /**
     * @description * `solid` - Uzluksiz
     *     * `dashed` - Uzlukli
     *     * `dotted` - Nuqtali
     * @enum {string}
     */
    LineStyleEnum: 'solid' | 'dashed' | 'dotted';
    /**
     * @description * `none` - Medalsiz
     *     * `gold` - Oltin
     *     * `silver` - Kumush
     *     * `bronze` - Bronza
     *     * `honourable_mention` - Faxriy yorliq
     *     * `other` - Boshqa sovrin
     * @enum {string}
     */
    MedalEnum: 'none' | 'gold' | 'silver' | 'bronze' | 'honourable_mention' | 'other';
    /**
     * @description * `default` - Oddiy tugun
     *     * `final` - Final tuguni
     *     * `training` - Tayyorgarlik tuguni
     * @enum {string}
     */
    NodeStyleEnum: 'default' | 'final' | 'training';
    PaginatedArticleListList: {
      /** @example 123 */
      count: number;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=4
       */
      next?: string | null;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=2
       */
      previous?: string | null;
      results: components['schemas']['ArticleList'][];
    };
    PaginatedBookmarkList: {
      /** @example 123 */
      count: number;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=4
       */
      next?: string | null;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=2
       */
      previous?: string | null;
      results: components['schemas']['Bookmark'][];
    };
    PaginatedEditProposalList: {
      /** @example 123 */
      count: number;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=4
       */
      next?: string | null;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=2
       */
      previous?: string | null;
      results: components['schemas']['EditProposal'][];
    };
    PaginatedGlossaryTermListList: {
      /** @example 123 */
      count: number;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=4
       */
      next?: string | null;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=2
       */
      previous?: string | null;
      results: components['schemas']['GlossaryTermList'][];
    };
    PaginatedPersonalNoteList: {
      /** @example 123 */
      count: number;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=4
       */
      next?: string | null;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=2
       */
      previous?: string | null;
      results: components['schemas']['PersonalNote'][];
    };
    PaginatedReadingProgressList: {
      /** @example 123 */
      count: number;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=4
       */
      next?: string | null;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=2
       */
      previous?: string | null;
      results: components['schemas']['ReadingProgress'][];
    };
    PaginatedReviewRecordList: {
      /** @example 123 */
      count: number;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=4
       */
      next?: string | null;
      /**
       * Format: uri
       * @example http://api.example.org/accounts/?page=2
       */
      previous?: string | null;
      results: components['schemas']['ReviewRecord'][];
    };
    Participant: {
      readonly aliases: string[];
      bio?: string;
      country_code?: string;
      full_name: string;
      handle?: string;
      /** Format: uuid */
      readonly id: string;
      photo_url?: string;
      region?: string;
      school?: string;
      slug: string;
    };
    ParticipantDetail: {
      readonly aliases: string[];
      bio?: string;
      country_code?: string;
      full_name: string;
      handle?: string;
      /** Format: uuid */
      readonly id: string;
      photo_url?: string;
      readonly platform_accounts: components['schemas']['ParticipantPlatformAccount'][];
      region?: string;
      school?: string;
      readonly season_results: components['schemas']['ParticipantSeasonResult'][];
      slug: string;
    };
    ParticipantPlatformAccount: {
      handle: string;
      /** Format: uuid */
      readonly id: string;
      is_verified?: boolean;
      /** Format: int64 */
      order?: number;
      platform: components['schemas']['ParticipantPlatformAccountPlatformEnum'];
      readonly platform_label: string;
      title?: string;
      /** Format: uri */
      url: string;
    };
    /**
     * @description * `codeforces` - Codeforces
     *     * `atcoder` - AtCoder
     *     * `kepuz` - KEP.uz
     *     * `robocontest` - Robocontest
     * @enum {string}
     */
    ParticipantPlatformAccountPlatformEnum: 'codeforces' | 'atcoder' | 'kepuz' | 'robocontest';
    ParticipantSeasonResult: {
      award_title?: string;
      category?: string;
      /** Format: date */
      readonly event_end_date: string | null;
      readonly event_short_title: string;
      readonly event_slug: string;
      /** Format: date */
      readonly event_start_date: string | null;
      readonly event_title: string;
      /** Format: uuid */
      readonly id: string;
      medal?: components['schemas']['MedalEnum'];
      /** Format: int64 */
      order?: number;
      /** Format: int64 */
      rank?: number | null;
      /** Format: uri */
      result_url?: string;
      /** Format: decimal */
      score?: string | null;
      score_label?: string;
    };
    PatchedEditProposalRequest: {
      article_slug?: string;
      change_summary?: string;
      proposed_content?: string;
      proposed_summary?: string;
      proposed_title?: string;
    };
    PatchedPersonalNoteRequest: {
      /** @description Maqoladagi sarlavha identifikatori yoki boshqa stabil belgi. */
      anchor?: string;
      article_slug?: string;
      body?: string;
      quote?: string;
    };
    PatchedReadingProgressRequest: {
      article_slug?: string;
      last_heading?: string;
      percent?: number;
      status?: components['schemas']['ReadingProgressStatusEnum'];
    };
    PatchedUserProfileRequest: {
      /**
       * Avatar manzili
       * Format: uri
       */
      avatar_url?: string;
      /** Qisqacha ma’lumot */
      bio?: string;
      /** Ko‘rinadigan ism */
      display_name?: string;
      /**
       * Email address
       * Format: email
       */
      email?: string;
      first_name?: string;
      /**
       * GitHub manzili
       * Format: uri
       */
      github_url?: string;
      last_name?: string;
      /** Tanlangan til */
      preferred_language?: components['schemas']['PreferredLanguageEnum'];
      /** Profil ochiq */
      public_profile?: boolean;
    };
    PersonalNote: {
      /** @description Maqoladagi sarlavha identifikatori yoki boshqa stabil belgi. */
      anchor?: string;
      readonly article: components['schemas']['ArticleList'];
      body: string;
      /** Format: date-time */
      readonly created_at: string;
      readonly id: number;
      quote?: string;
      /** Format: date-time */
      readonly updated_at: string;
    };
    PersonalNoteRequest: {
      /** @description Maqoladagi sarlavha identifikatori yoki boshqa stabil belgi. */
      anchor?: string;
      article_slug: string;
      body: string;
      quote?: string;
    };
    PracticeReference: {
      difficulty_label?: string;
      readonly id: number;
      level?: components['schemas']['LevelEnum'];
      readonly level_label: string;
      note?: string;
      /** Format: int64 */
      order?: number;
      platform: components['schemas']['PracticeReferencePlatformEnum'];
      readonly platform_name: string;
      title: string;
      /** Format: uri */
      url: string;
    };
    /**
     * @description * `codeforces` - Codeforces
     *     * `atcoder` - AtCoder
     *     * `cses` - CSES
     *     * `kattis` - Kattis
     *     * `spoj` - SPOJ
     *     * `leetcode` - LeetCode
     *     * `kep` - KEP.uz
     *     * `other` - Boshqa
     * @enum {string}
     */
    PracticeReferencePlatformEnum:
      | 'codeforces'
      | 'atcoder'
      | 'cses'
      | 'kattis'
      | 'spoj'
      | 'leetcode'
      | 'kep'
      | 'other';
    /**
     * @description * `uz-latn` - O‘zbekcha
     *     * `ru` - Русский
     *     * `en` - English
     * @enum {string}
     */
    PreferredLanguageEnum: 'uz-latn' | 'ru' | 'en';
    Prerequisite: {
      readonly article: components['schemas']['ArticleLink'];
      note?: string;
      /** Format: int64 */
      order?: number;
    };
    ProblemAttachment: {
      content_type?: string;
      /** Format: uuid */
      readonly id: string;
      /** Format: int64 */
      order?: number;
      /** Format: int64 */
      size_bytes?: number | null;
      title: string;
      /** Format: uri */
      url: string;
    };
    ProblemCatalogEvent: {
      event: components['schemas']['ProblemCatalogEventLink'];
      readonly problem_count: number;
      season: components['schemas']['SeasonLink'];
      readonly sets: components['schemas']['ProblemSet'][];
    };
    ProblemCatalogEventLink: {
      code: string;
      date_label: string;
      /** Format: date */
      end_date: string | null;
      event_status: string;
      short_title: string;
      slug: string;
      /** Format: date */
      start_date: string | null;
      summary: string;
      title: string;
    };
    ProblemCatalogResponse: {
      events: components['schemas']['ProblemCatalogEvent'][];
      seasons: components['schemas']['SeasonLink'][];
    };
    ProblemDetail: {
      readonly attachments: components['schemas']['ProblemAttachment'][];
      code: string;
      difficulty_label?: string;
      readonly event: components['schemas']['EventGraph'];
      /** Format: uuid */
      readonly id: string;
      /** Format: date */
      last_verified_on: string | null;
      readonly links: components['schemas']['ProblemLink'][];
      /** Format: decimal */
      max_score: string | null;
      memory_limit_mb: number | null;
      /** Format: int64 */
      order?: number;
      original_title?: string;
      readonly problem_set: components['schemas']['ProblemSetLink'];
      problem_type?: components['schemas']['ProblemTypeEnum'];
      readonly problem_type_label: string;
      /** Format: int64 */
      rating?: number | null;
      readonly season: components['schemas']['SeasonLink'];
      readonly sets: components['schemas']['ProblemSet'][];
      slug: string;
      source_path: string;
      statement_markdown: string;
      readonly statement_pdf: components['schemas']['StatementPdf'] | null;
      tags: string[];
      time_limit_ms: number | null;
      title: string;
      translation_status?: components['schemas']['TranslationStatusEnum'];
      readonly translation_status_label: string;
    };
    ProblemEventResponse: {
      event: components['schemas']['EventGraph'];
      season: components['schemas']['SeasonLink'];
      sets: components['schemas']['ProblemSet'][];
    };
    ProblemLink: {
      /** Format: uuid */
      readonly id: string;
      is_official?: boolean;
      is_primary?: boolean;
      kind: components['schemas']['ProblemLinkKindEnum'];
      readonly kind_label: string;
      /** Format: int64 */
      order?: number;
      platform?: string;
      title: string;
      /** Format: uri */
      url: string;
    };
    /**
     * @description * `original` - Original shart
     *     * `practice` - Yechish
     *     * `editorial` - Tahlil
     *     * `package` - Masala paketi
     *     * `solution` - Yechim
     * @enum {string}
     */
    ProblemLinkKindEnum: 'original' | 'practice' | 'editorial' | 'package' | 'solution';
    ProblemSet: {
      date_label?: string;
      description?: string;
      /** Format: uuid */
      readonly id: string;
      /** Format: int64 */
      order?: number;
      readonly problems: components['schemas']['ProblemSummary'][];
      slug: string;
      title: string;
    };
    ProblemSetLink: {
      date_label: string;
      order: number;
      slug: string;
      title: string;
    };
    ProblemSummary: {
      code: string;
      difficulty_label?: string;
      /** Format: uuid */
      readonly id: string;
      /** Format: int64 */
      order?: number;
      original_title?: string;
      problem_type?: components['schemas']['ProblemTypeEnum'];
      readonly problem_type_label: string;
      /** Format: int64 */
      rating?: number | null;
      slug: string;
      title: string;
      translation_status?: components['schemas']['TranslationStatusEnum'];
      readonly translation_status_label: string;
    };
    /**
     * @description * `standard` - Standart
     *     * `interactive` - Interaktiv
     *     * `output_only` - Faqat output
     *     * `communication` - Kommunikatsion
     *     * `two_step` - Ikki bosqichli
     * @enum {string}
     */
    ProblemTypeEnum: 'standard' | 'interactive' | 'output_only' | 'communication' | 'two_step';
    ProposalReviewInputRequest: {
      decision: components['schemas']['DecisionEnum'];
      notes?: string;
      stage: components['schemas']['StageEnum'];
    };
    /**
     * @description * `draft` - Qoralama
     *     * `submitted` - Yuborilgan
     *     * `in_review` - Ko‘rib chiqilmoqda
     *     * `changes_requested` - O‘zgartirish so‘ralgan
     *     * `approved` - Tasdiqlangan
     *     * `rejected` - Rad etilgan
     *     * `merged` - Qo‘shilgan
     *     * `withdrawn` - Qaytarib olingan
     * @enum {string}
     */
    ProposalStatusEnum:
      | 'draft'
      | 'submitted'
      | 'in_review'
      | 'changes_requested'
      | 'approved'
      | 'rejected'
      | 'merged'
      | 'withdrawn';
    ProposalTransitionInputRequest: {
      note?: string;
    };
    /**
     * @description * `official` - official
     *     * `generated` - generated
     *     * `` -
     * @enum {string}
     */
    ProvenanceEnum: 'official' | 'generated';
    PublicStats: {
      articles: number;
      categories: number;
      editorial: components['schemas']['EditorialStats'];
      full_translations: number;
      practice_references: number;
      synopsis_drafts: number;
    };
    ReadingProgress: {
      readonly article: components['schemas']['ArticleList'];
      /** Format: date-time */
      readonly created_at: string;
      readonly id: number;
      last_heading?: string;
      /** Format: date-time */
      readonly last_read_at: string;
      percent?: number;
      status?: components['schemas']['ReadingProgressStatusEnum'];
      /** Format: date-time */
      readonly updated_at: string;
    };
    ReadingProgressRequest: {
      article_slug: string;
      last_heading?: string;
      percent?: number;
      status?: components['schemas']['ReadingProgressStatusEnum'];
    };
    /**
     * @description * `not_started` - Boshlanmagan
     *     * `in_progress` - O‘qilmoqda
     *     * `completed` - Tugallangan
     * @enum {string}
     */
    ReadingProgressStatusEnum: 'not_started' | 'in_progress' | 'completed';
    /**
     * @description * `qualifies_to` - Keyingi bosqichga saralaydi
     *     * `feeds_into` - Nomzodlar bazasiga olib boradi
     *     * `training_for` - Tayyorgarlik hisoblanadi
     *     * `related_to` - Aloqador
     * @enum {string}
     */
    RelationTypeEnum: 'qualifies_to' | 'feeds_into' | 'training_for' | 'related_to';
    ResultEntry: {
      award_title?: string;
      category?: string;
      /** Format: uuid */
      readonly id: string;
      is_local?: boolean;
      medal?: components['schemas']['MedalEnum'];
      notes?: string;
      /** Format: int64 */
      order?: number;
      readonly participant: components['schemas']['Participant'] | null;
      /** Format: int64 */
      rank?: number | null;
      /** Format: uri */
      result_url?: string;
      /** Format: decimal */
      score?: string | null;
      score_label?: string;
      readonly team: components['schemas']['Team'] | null;
    };
    ReviewDecision: {
      /** Format: date-time */
      created_at: string;
      decision: components['schemas']['DecisionEnum'];
    };
    ReviewRecord: {
      content_hash: string;
      /** Format: date-time */
      readonly created_at: string;
      decision: components['schemas']['DecisionEnum'];
      readonly decision_label: string;
      /** Format: uuid */
      readonly id: string;
      readonly is_current: boolean;
      notes?: string;
      readonly reviewer: components['schemas']['UserSummary'];
      stage: components['schemas']['StageEnum'];
      readonly stage_label: string;
    };
    ReviewRecordRequest: {
      content_hash: string;
      decision: components['schemas']['DecisionEnum'];
      notes?: string;
      stage: components['schemas']['StageEnum'];
    };
    Route: {
      code: string;
      color?: components['schemas']['ColorEnum'];
      description?: string;
      icon?: string;
      /** Format: uuid */
      readonly id: string;
      kind: components['schemas']['RouteKindEnum'];
      line_style?: components['schemas']['LineStyleEnum'];
      /** Format: int64 */
      order?: number;
      title: string;
    };
    /**
     * @description * `official` - Rasmiy olimpiada
     *     * `selection` - Saralash
     *     * `international` - Xalqaro olimpiada
     *     * `unofficial` - Norasmiy musobaqa
     *     * `training` - Rasmiy tayyorgarlik
     * @enum {string}
     */
    RouteKindEnum: 'official' | 'selection' | 'international' | 'unofficial' | 'training';
    /**
     * @description * `tba` - E’lon qilinadi
     *     * `onsite` - Joyida
     *     * `online` - Onlayn
     *     * `hybrid` - Gibrid
     * @enum {string}
     */
    SeasonEventModeEnum: 'tba' | 'onsite' | 'online' | 'hybrid';
    /**
     * @description * `stage` - Bosqich
     *     * `selection` - Saralash
     *     * `training` - Tayyorgarlik
     *     * `international` - Xalqaro olimpiada
     *     * `unofficial` - Norasmiy musobaqa
     * @enum {string}
     */
    SeasonEventTypeEnum: 'stage' | 'selection' | 'training' | 'international' | 'unofficial';
    SeasonGraph: {
      readonly edges: components['schemas']['EventEdge'][];
      /** Format: date */
      end_date: string;
      readonly events: components['schemas']['EventGraph'][];
      /** Format: uuid */
      readonly id: string;
      is_featured?: boolean;
      /** Format: int64 */
      order?: number;
      readonly routes: components['schemas']['Route'][];
      slug: string;
      /** Format: date */
      start_date: string;
      summary?: string;
      title: string;
      verification_status?: components['schemas']['SeasonVerificationStatusEnum'];
      /** Format: date-time */
      verified_at?: string | null;
    };
    SeasonLink: {
      /** Format: date */
      end_date: string;
      slug: string;
      /** Format: date */
      start_date: string;
      title: string;
    };
    SeasonList: {
      /** Format: date */
      end_date: string;
      readonly event_count: number;
      /** Format: uuid */
      readonly id: string;
      is_featured?: boolean;
      /** Format: int64 */
      order?: number;
      slug: string;
      /** Format: date */
      start_date: string;
      summary?: string;
      title: string;
      verification_status?: components['schemas']['SeasonVerificationStatusEnum'];
      /** Format: date-time */
      verified_at?: string | null;
    };
    /**
     * @description * `official_page` - Rasmiy sahifa
     *     * `announcement` - E’lon
     *     * `schedule` - Jadval
     *     * `rules` - Nizom va qoidalar
     *     * `registration` - Ro‘yxatdan o‘tish
     *     * `platform` - Platforma
     *     * `participants` - Ishtirokchilar
     *     * `tasks` - Masalalar
     *     * `editorial` - Tahlillar
     *     * `scoreboard` - Natijalar jadvali
     *     * `results` - Natijalar
     *     * `photos` - Rasmlar
     *     * `videos` - Videolar
     *     * `mirror` - Mirror
     *     * `other` - Boshqa
     * @enum {string}
     */
    SeasonResourceTypeEnum:
      | 'official_page'
      | 'announcement'
      | 'schedule'
      | 'rules'
      | 'registration'
      | 'platform'
      | 'participants'
      | 'tasks'
      | 'editorial'
      | 'scoreboard'
      | 'results'
      | 'photos'
      | 'videos'
      | 'mirror'
      | 'other';
    /**
     * @description * `official` - Rasmiy manba
     *     * `government` - Davlat manbasi
     *     * `organizer` - Tashkilotchi
     *     * `press` - Matbuot
     *     * `archive` - Arxiv
     *     * `official_page` - Rasmiy sahifa
     *     * `official_announcement` - Rasmiy e’lon
     *     * `official_results` - Rasmiy natijalar
     *     * `official_regulation` - Rasmiy nizom
     *     * `organizer_archive` - Tashkilotchi arxivi
     *     * `government_news` - Davlat yangiliklari
     *     * `community_report` - Hamjamiyat xabari
     *     * `other` - Boshqa
     * @enum {string}
     */
    SeasonSourceTypeEnum:
      | 'official'
      | 'government'
      | 'organizer'
      | 'press'
      | 'archive'
      | 'official_page'
      | 'official_announcement'
      | 'official_results'
      | 'official_regulation'
      | 'organizer_archive'
      | 'government_news'
      | 'community_report'
      | 'other';
    /**
     * @description * `unverified` - Tekshirilmagan
     *     * `pending` - Tekshiruv kutilmoqda
     *     * `verified` - Tekshirilgan
     *     * `disputed` - Aniqlashtirilmoqda
     * @enum {string}
     */
    SeasonVerificationStatusEnum: 'unverified' | 'pending' | 'verified' | 'disputed';
    /**
     * @description * `technical` - Texnik review
     *     * `language` - Til reviewi
     *     * `editorial` - Tahririy review
     * @enum {string}
     */
    StageEnum: 'technical' | 'language' | 'editorial';
    StatementPdf: {
      language: string;
      page_count: number | null;
      provenance: components['schemas']['ProvenanceEnum'] | components['schemas']['BlankEnum'];
      provenance_label: string;
      sha256: string;
      size_bytes: number | null;
      /** Format: uri */
      source_url: string;
      url: string;
    };
    StatusEvent: {
      readonly actor: components['schemas']['UserSummary'];
      /** Format: date-time */
      readonly created_at: string;
      from_status: components['schemas']['ProposalStatusEnum'];
      note?: string;
      to_status: components['schemas']['ProposalStatusEnum'];
    };
    StatusEventRequest: {
      from_status: components['schemas']['ProposalStatusEnum'];
      note?: string;
      to_status: components['schemas']['ProposalStatusEnum'];
    };
    Tag: {
      description?: string;
      readonly id: number;
      name: string;
      slug: string;
    };
    TagRequest: {
      description?: string;
      name: string;
      slug: string;
    };
    Team: {
      code?: string;
      country_code?: string;
      /** Format: uuid */
      readonly id: string;
      readonly members: components['schemas']['TeamMember'][];
      name: string;
      school?: string;
    };
    TeamMember: {
      /** Format: int64 */
      order?: number;
      readonly participant: components['schemas']['Participant'];
      role?: components['schemas']['TeamMemberRoleEnum'];
    };
    /**
     * @description * `contestant` - Ishtirokchi
     *     * `leader` - Jamoa rahbari
     *     * `deputy` - Rahbar o‘rinbosari
     *     * `coach` - Murabbiy
     *     * `other` - Boshqa
     * @enum {string}
     */
    TeamMemberRoleEnum: 'contestant' | 'leader' | 'deputy' | 'coach' | 'other';
    TokenRefresh: {
      readonly access: string;
      refresh: string;
    };
    TokenRefreshRequest: {
      refresh: string;
    };
    /**
     * @description * `ai_translation` - AI-tarjima
     *     * `reviewed_translation` - Tekshiruvdan o‘tgan tarjima
     *     * `original_uzbek` - O‘zbekcha original
     * @enum {string}
     */
    TranslationStatusEnum: 'ai_translation' | 'reviewed_translation' | 'original_uzbek';
    UserProfile: {
      /**
       * Avatar manzili
       * Format: uri
       */
      avatar_url?: string;
      /** Qisqacha ma’lumot */
      bio?: string;
      /** Format: date-time */
      readonly date_joined: string;
      /** Ko‘rinadigan ism */
      display_name?: string;
      /**
       * Email address
       * Format: email
       */
      email?: string;
      first_name?: string;
      /**
       * GitHub manzili
       * Format: uri
       */
      github_url?: string;
      readonly id: number;
      readonly is_guest: boolean;
      last_name?: string;
      readonly name: string;
      /** Tanlangan til */
      preferred_language?: components['schemas']['PreferredLanguageEnum'];
      /** Profil ochiq */
      public_profile?: boolean;
      /** @description Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
      readonly username: string;
    };
    UserProfileRequest: {
      /**
       * Avatar manzili
       * Format: uri
       */
      avatar_url?: string;
      /** Qisqacha ma’lumot */
      bio?: string;
      /** Ko‘rinadigan ism */
      display_name?: string;
      /**
       * Email address
       * Format: email
       */
      email?: string;
      first_name?: string;
      /**
       * GitHub manzili
       * Format: uri
       */
      github_url?: string;
      last_name?: string;
      /** Tanlangan til */
      preferred_language?: components['schemas']['PreferredLanguageEnum'];
      /** Profil ochiq */
      public_profile?: boolean;
    };
    UserSummary: {
      /**
       * Avatar manzili
       * Format: uri
       */
      avatar_url?: string;
      first_name?: string;
      /**
       * GitHub manzili
       * Format: uri
       */
      github_url?: string;
      readonly id: number;
      readonly is_guest: boolean;
      last_name?: string;
      readonly name: string;
      /** @description Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
      username: string;
    };
    UserSummaryRequest: {
      /**
       * Avatar manzili
       * Format: uri
       */
      avatar_url?: string;
      first_name?: string;
      /**
       * GitHub manzili
       * Format: uri
       */
      github_url?: string;
      last_name?: string;
      /** @description Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
      username: string;
    };
    /**
     * @description * `private` - Yopiq
     *     * `unlisted` - Faqat havola orqali
     *     * `public` - Ochiq
     * @enum {string}
     */
    VisibilityEnum: 'private' | 'unlisted' | 'public';
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  api_v1_accounts_me_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UserProfile'];
        };
      };
    };
  };
  api_v1_accounts_me_update: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['UserProfileRequest'];
        'application/x-www-form-urlencoded': components['schemas']['UserProfileRequest'];
        'multipart/form-data': components['schemas']['UserProfileRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UserProfile'];
        };
      };
    };
  };
  api_v1_accounts_me_partial_update: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['PatchedUserProfileRequest'];
        'application/x-www-form-urlencoded': components['schemas']['PatchedUserProfileRequest'];
        'multipart/form-data': components['schemas']['PatchedUserProfileRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UserProfile'];
        };
      };
    };
  };
  api_v1_articles_list: {
    parameters: {
      query?: {
        category?: string;
        /**
         * @description * `beginner` - Boshlang‘ich
         *     * `intermediate` - O‘rta
         *     * `advanced` - Yuqori
         */
        difficulty?: ('advanced' | 'beginner' | 'intermediate')[];
        featured?: boolean;
        language?: string;
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A page number within the paginated result set. */
        page?: number;
        /** @description Number of results to return per page. */
        page_size?: number;
        prerequisite?: string;
        /** @description A search term. */
        search?: string;
        tag?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PaginatedArticleListList'];
        };
      };
    };
  };
  api_v1_articles_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ArticleDetail'];
        };
      };
    };
  };
  api_v1_articles_all_list: {
    parameters: {
      query?: {
        category?: string;
        /**
         * @description * `beginner` - Boshlang‘ich
         *     * `intermediate` - O‘rta
         *     * `advanced` - Yuqori
         */
        difficulty?: ('advanced' | 'beginner' | 'intermediate')[];
        featured?: boolean;
        language?: string;
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        prerequisite?: string;
        /** @description A search term. */
        search?: string;
        tag?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ArticleList'][];
        };
      };
    };
  };
  api_v1_articles_by_path_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        canonical_path: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ArticleDetail'];
        };
      };
    };
  };
  api_v1_auth_account_destroy: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AccountDeleteRequest'];
        'application/x-www-form-urlencoded': components['schemas']['AccountDeleteRequest'];
        'multipart/form-data': components['schemas']['AccountDeleteRequest'];
      };
    };
    responses: {
      /** @description Akkaunt va unga tegishli barcha shaxsiy ma’lumotlar o‘chirildi. */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  api_v1_auth_guest_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['GuestSessionRequestRequest'];
        'application/x-www-form-urlencoded': components['schemas']['GuestSessionRequestRequest'];
        'multipart/form-data': components['schemas']['GuestSessionRequestRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['GuestAuthResponse'];
        };
      };
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['GuestAuthResponse'];
        };
      };
    };
  };
  api_v1_auth_guest_upgrade_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['GuestUpgradeRequestRequest'];
        'application/x-www-form-urlencoded': components['schemas']['GuestUpgradeRequestRequest'];
        'multipart/form-data': components['schemas']['GuestUpgradeRequestRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['GuestUpgradeResponse'];
        };
      };
    };
  };
  api_v1_auth_login_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CpuzTokenObtainPairRequest'];
        'application/x-www-form-urlencoded': components['schemas']['CpuzTokenObtainPairRequest'];
        'multipart/form-data': components['schemas']['CpuzTokenObtainPairRequest'];
      };
    };
    responses: {
      /** @description No response body */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  api_v1_auth_token_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CpuzTokenObtainPairRequest'];
        'application/x-www-form-urlencoded': components['schemas']['CpuzTokenObtainPairRequest'];
        'multipart/form-data': components['schemas']['CpuzTokenObtainPairRequest'];
      };
    };
    responses: {
      /** @description No response body */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  api_v1_auth_token_refresh_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['TokenRefreshRequest'];
        'application/x-www-form-urlencoded': components['schemas']['TokenRefreshRequest'];
        'multipart/form-data': components['schemas']['TokenRefreshRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['TokenRefresh'];
        };
      };
    };
  };
  api_v1_categories_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Category'][];
        };
      };
    };
  };
  api_v1_categories_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Category'];
        };
      };
    };
  };
  api_v1_contributions_proposals_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A page number within the paginated result set. */
        page?: number;
        /** @description Number of results to return per page. */
        page_size?: number;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PaginatedEditProposalList'];
        };
      };
    };
  };
  api_v1_contributions_proposals_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EditProposalRequest'];
        'application/x-www-form-urlencoded': components['schemas']['EditProposalRequest'];
        'multipart/form-data': components['schemas']['EditProposalRequest'];
      };
    };
    responses: {
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EditProposal'];
        };
      };
    };
  };
  api_v1_contributions_proposals_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A UUID string identifying this edit proposal. */
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EditProposal'];
        };
      };
    };
  };
  api_v1_contributions_proposals_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A UUID string identifying this edit proposal. */
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['EditProposalRequest'];
        'application/x-www-form-urlencoded': components['schemas']['EditProposalRequest'];
        'multipart/form-data': components['schemas']['EditProposalRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EditProposal'];
        };
      };
    };
  };
  api_v1_contributions_proposals_destroy: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A UUID string identifying this edit proposal. */
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description No response body */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  api_v1_contributions_proposals_partial_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A UUID string identifying this edit proposal. */
        id: string;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['PatchedEditProposalRequest'];
        'application/x-www-form-urlencoded': components['schemas']['PatchedEditProposalRequest'];
        'multipart/form-data': components['schemas']['PatchedEditProposalRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EditProposal'];
        };
      };
    };
  };
  api_v1_contributions_proposals_review_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A UUID string identifying this edit proposal. */
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ProposalReviewInputRequest'];
        'application/x-www-form-urlencoded': components['schemas']['ProposalReviewInputRequest'];
        'multipart/form-data': components['schemas']['ProposalReviewInputRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ReviewRecord'];
        };
      };
    };
  };
  api_v1_contributions_proposals_submit_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A UUID string identifying this edit proposal. */
        id: string;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['ProposalTransitionInputRequest'];
        'application/x-www-form-urlencoded': components['schemas']['ProposalTransitionInputRequest'];
        'multipart/form-data': components['schemas']['ProposalTransitionInputRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EditProposal'];
        };
      };
    };
  };
  api_v1_contributions_proposals_withdraw_create: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A UUID string identifying this edit proposal. */
        id: string;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['ProposalTransitionInputRequest'];
        'application/x-www-form-urlencoded': components['schemas']['ProposalTransitionInputRequest'];
        'multipart/form-data': components['schemas']['ProposalTransitionInputRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EditProposal'];
        };
      };
    };
  };
  api_v1_contributions_reviews_list: {
    parameters: {
      query?: {
        article__slug?: string;
        /**
         * @description * `approved` - Tasdiqlandi
         *     * `changes_requested` - O‘zgartirish so‘raldi
         *     * `rejected` - Rad etildi
         */
        decision?: 'approved' | 'changes_requested' | 'rejected';
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A page number within the paginated result set. */
        page?: number;
        /** @description Number of results to return per page. */
        page_size?: number;
        proposal?: string;
        /** @description A search term. */
        search?: string;
        /**
         * @description * `technical` - Texnik review
         *     * `language` - Til reviewi
         *     * `editorial` - Tahririy review
         */
        stage?: 'editorial' | 'language' | 'technical';
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PaginatedReviewRecordList'];
        };
      };
    };
  };
  api_v1_contributions_reviews_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A UUID string identifying this review record. */
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ReviewRecord'];
        };
      };
    };
  };
  api_v1_feedback_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            [key: string]: unknown;
          };
        };
      };
    };
  };
  api_v1_feedback_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['FeedbackSubmissionRequest'];
        'application/x-www-form-urlencoded': components['schemas']['FeedbackSubmissionRequest'];
        'multipart/form-data': components['schemas']['FeedbackSubmissionRequest'];
      };
    };
    responses: {
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['FeedbackSubmission'];
        };
      };
    };
  };
  api_v1_glossary_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A page number within the paginated result set. */
        page?: number;
        /** @description Number of results to return per page. */
        page_size?: number;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PaginatedGlossaryTermListList'];
        };
      };
    };
  };
  api_v1_glossary_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['GlossaryTermDetail'];
        };
      };
    };
  };
  api_v1_glossary_all_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['GlossaryTermList'][];
        };
      };
    };
  };
  api_v1_glossary_leaderboard_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['GlossaryQuizState'];
        };
      };
    };
  };
  api_v1_glossary_questions_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['GlossaryQuizQuestion'];
        };
      };
    };
  };
  api_v1_glossary_score_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['GlossaryQuizSubmissionRequest'];
        'application/x-www-form-urlencoded': components['schemas']['GlossaryQuizSubmissionRequest'];
        'multipart/form-data': components['schemas']['GlossaryQuizSubmissionRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['GlossaryQuizScoreResponse'];
        };
      };
    };
  };
  api_v1_me_bookmarks_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A page number within the paginated result set. */
        page?: number;
        /** @description Number of results to return per page. */
        page_size?: number;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PaginatedBookmarkList'];
        };
      };
    };
  };
  api_v1_me_bookmarks_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['BookmarkRequest'];
        'application/x-www-form-urlencoded': components['schemas']['BookmarkRequest'];
        'multipart/form-data': components['schemas']['BookmarkRequest'];
      };
    };
    responses: {
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Bookmark'];
        };
      };
    };
  };
  api_v1_me_bookmarks_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this bookmark. */
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Bookmark'];
        };
      };
    };
  };
  api_v1_me_bookmarks_destroy: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this bookmark. */
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description No response body */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  api_v1_me_bookmarks_all_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Bookmark'][];
        };
      };
    };
  };
  api_v1_me_notes_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A page number within the paginated result set. */
        page?: number;
        /** @description Number of results to return per page. */
        page_size?: number;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PaginatedPersonalNoteList'];
        };
      };
    };
  };
  api_v1_me_notes_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PersonalNoteRequest'];
        'application/x-www-form-urlencoded': components['schemas']['PersonalNoteRequest'];
        'multipart/form-data': components['schemas']['PersonalNoteRequest'];
      };
    };
    responses: {
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PersonalNote'];
        };
      };
    };
  };
  api_v1_me_notes_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this personal note. */
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PersonalNote'];
        };
      };
    };
  };
  api_v1_me_notes_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this personal note. */
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PersonalNoteRequest'];
        'application/x-www-form-urlencoded': components['schemas']['PersonalNoteRequest'];
        'multipart/form-data': components['schemas']['PersonalNoteRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PersonalNote'];
        };
      };
    };
  };
  api_v1_me_notes_destroy: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this personal note. */
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description No response body */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  api_v1_me_notes_partial_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this personal note. */
        id: number;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['PatchedPersonalNoteRequest'];
        'application/x-www-form-urlencoded': components['schemas']['PatchedPersonalNoteRequest'];
        'multipart/form-data': components['schemas']['PatchedPersonalNoteRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PersonalNote'];
        };
      };
    };
  };
  api_v1_me_notes_all_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PersonalNote'][];
        };
      };
    };
  };
  api_v1_me_progress_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A page number within the paginated result set. */
        page?: number;
        /** @description Number of results to return per page. */
        page_size?: number;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PaginatedReadingProgressList'];
        };
      };
    };
  };
  api_v1_me_progress_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ReadingProgressRequest'];
        'application/x-www-form-urlencoded': components['schemas']['ReadingProgressRequest'];
        'multipart/form-data': components['schemas']['ReadingProgressRequest'];
      };
    };
    responses: {
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ReadingProgress'];
        };
      };
    };
  };
  api_v1_me_progress_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this reading progress. */
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ReadingProgress'];
        };
      };
    };
  };
  api_v1_me_progress_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this reading progress. */
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ReadingProgressRequest'];
        'application/x-www-form-urlencoded': components['schemas']['ReadingProgressRequest'];
        'multipart/form-data': components['schemas']['ReadingProgressRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ReadingProgress'];
        };
      };
    };
  };
  api_v1_me_progress_destroy: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this reading progress. */
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description No response body */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  api_v1_me_progress_partial_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description A unique integer value identifying this reading progress. */
        id: number;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['PatchedReadingProgressRequest'];
        'application/x-www-form-urlencoded': components['schemas']['PatchedReadingProgressRequest'];
        'multipart/form-data': components['schemas']['PatchedReadingProgressRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ReadingProgress'];
        };
      };
    };
  };
  api_v1_me_progress_all_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ReadingProgress'][];
        };
      };
    };
  };
  problem_catalog: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ProblemCatalogResponse'];
        };
      };
    };
  };
  problem_event: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        event_slug: string;
        season_slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ProblemEventResponse'];
        };
      };
    };
  };
  problem_detail: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        event_slug: string;
        problem_slug: string;
        season_slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ProblemDetail'];
        };
      };
    };
  };
  problem_statement_pdf: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        event_slug: string;
        problem_slug: string;
        season_slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/pdf': string;
        };
      };
    };
  };
  api_v1_search_retrieve: {
    parameters: {
      query: {
        limit?: number;
        q: string;
        /**
         * @description * `all` - all
         *     * `articles` - articles
         *     * `glossary` - glossary
         *     * `categories` - categories
         */
        scope?: 'all' | 'articles' | 'glossary' | 'categories';
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            [key: string]: unknown;
          };
        };
      };
    };
  };
  api_v1_seasons_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SeasonList'][];
        };
      };
    };
  };
  api_v1_seasons_events_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        event_slug: string;
        season_slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EventDetail'];
        };
      };
    };
  };
  api_v1_seasons_participants_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        participant_slug: string;
        season_slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ParticipantDetail'];
        };
      };
    };
  };
  api_v1_seasons_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SeasonGraph'];
        };
      };
    };
  };
  api_v1_seasons_current_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SeasonGraph'];
        };
      };
    };
  };
  api_v1_stats_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PublicStats'];
        };
      };
    };
  };
  api_v1_tags_list: {
    parameters: {
      query?: {
        /** @description Which field to use when ordering the results. */
        ordering?: string;
        /** @description A search term. */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Tag'][];
        };
      };
    };
  };
  api_v1_tags_retrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        slug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Tag'];
        };
      };
    };
  };
}
