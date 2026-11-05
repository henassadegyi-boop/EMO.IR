EMO Academy — راه‌اندازی ورود واقعی

فایل‌ها:
- index.html
- style.css
- app.js

راه‌اندازی احراز هویت واقعی با Supabase:
1) در https://supabase.com یک پروژه بساز.
2) از Project Settings > API، مقدار Project URL و anon/public key را بردار.
3) در app.js مقدارهای SUPABASE_URL و SUPABASE_ANON_KEY را جایگزین کن.
   فقط کلید anon/public را در سایت قرار بده؛ هرگز service_role key را منتشر نکن.
4) در Supabase > Authentication > URL Configuration، آدرس سایتت را در Site URL و Redirect URLs ثبت کن.
5) برای تست محلی بهتر است از یک سرور محلی استفاده کنی (مثلاً VS Code Live Server)، نه باز کردن مستقیم فایل.
6) در Authentication > Providers مطمئن شو Email فعال است. برای تأیید ایمیل، تنظیمات SMTP و قالب ایمیل را مطابق نیازت تنظیم کن.

امکانات:
- ثبت‌نام ایمیل/رمز عبور
- ورود واقعی با ایمیل/رمز عبور
- خروج از حساب
- بازیابی رمز عبور با ایمیل
- نگه‌داشتن نشست کاربر
- رابط فارسی راست‌به‌چپ و واکنش‌گرا

نکته: این پروژه رابط کاربری و اتصال کلاینت را آماده دارد؛ ورود واقعی پس از وارد کردن Project URL و anon/public key پروژه Supabase فعال می‌شود.
