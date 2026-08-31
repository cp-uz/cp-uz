---
article_id: schedules--schedule-with-completion-duration
---
# Deadline va davomiyliklar berilganda ishlarning optimal jadvali

Bizga ishlar to‘plami berilgan va har bir ishning tugash muddati hamda davomiyligi ma’lum bo‘lsin. Ish boshlanganidan keyin uni yakunlamasdan turib to‘xtatib bo‘lmaydi. Eng ko‘p ishni bajarishga imkon beradigan jadval tuzish talab etiladi.

## Yechim

Yechim **ochko‘z algoritm**ga asoslanadi. Barcha ishlarni tugash muddati bo‘yicha saralaymiz va ularni kamayish tartibida ko‘rib chiqamiz. Shuningdek, ishlarni asta-sekin qo‘shib, davomiyligi eng kichik bo‘lganini chiqarib olish uchun $q$ navbatini tuzamiz; buning uchun, masalan, `set` yoki `priority_queue` ishlatish mumkin. Dastlab $q$ bo‘sh.

Faraz qilaylik, $i$-ishni ko‘rib chiqyapmiz. Avval uni $q$ ga qo‘shamiz. $i$-ishning tugash muddati bilan $(i-1)$-ishning tugash muddati orasidagi vaqt oralig‘ini olaylik; uning uzunligi $T$ bo‘lsin. $q$ dan qolgan davomiyligi kichik ishlarni tartib bilan chiqarib, $T$ oralig‘i to‘lguncha bajaramiz. Muhim jihat: chiqarilgan ish $T$ tugaguncha faqat qisman bajarilsa, uni imkon qadar, ya’ni qolgan $T$ vaqt davomida bajaramiz va ishning bajarilmagan qismini yana $q$ ga qaytaramiz.

Algoritm yakunida optimal yechimlardan biri olinadi. Uning ishlash vaqti $O(n \log n)$.

## Amalga oshirish

Quyidagi funksiya tugash muddati, davomiyligi va indeksi saqlangan ishlar vektorini qabul qilib, optimal jadvalda ishlatilgan barcha ishlar indekslarini qaytaradi. Jadvalning o‘zini vaqt tartibida yozish kerak bo‘lsa, tanlangan ishlarni yana tugash muddati bo‘yicha saralash zarur.

```{.cpp file=schedule_deadline_duration}
struct Job {
    int deadline, duration, idx;

    bool operator<(Job o) const {
        return deadline < o.deadline;
    }
};

vector<int> compute_schedule(vector<Job> jobs) {
    sort(jobs.begin(), jobs.end());

    set<pair<int,int>> s;
    vector<int> schedule;
    for (int i = jobs.size()-1; i >= 0; i--) {
        int t = jobs[i].deadline - (i ? jobs[i-1].deadline : 0);
        s.insert(make_pair(jobs[i].duration, jobs[i].idx));
        while (t && !s.empty()) {
            auto it = s.begin();
            if (it->first <= t) {
                t -= it->first;
                schedule.push_back(it->second);
            } else {
                s.insert(make_pair(it->first - t, it->second));
                t = 0;
            }
            s.erase(it);
        }
    }
    return schedule;
}
```
