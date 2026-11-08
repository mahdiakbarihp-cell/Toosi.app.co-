# سایت TOOSI.APP.CO

سایت شخصی و پورتفولیوی مهدی طوسی؛ طراحی وب، توسعهٔ اندروید، UI/UX، نرم‌افزار اختصاصی، مشاورهٔ فنی و مهندسی.

- استاتیک و بدون build: HTML / CSS / JS خالص
- دوزبانهٔ فارسی/انگلیسی با `localStorage`، پیش‌فرض RTL
- پورتفولیوی داده‌محور از `data/projects.json`
- صفحهٔ مستقل برای هر پروژه و هر خدمت
- آمادهٔ آپلود مستقیم روی **Cloudflare Pages** و دامنهٔ `toosiappco.ir`

---

## ساختار فایل‌ها

```
index.html                     صفحهٔ اصلی
portfolio/index.html           فهرست نمونه‌کارها + فیلترها
project.html                   قالب عمومی صفحهٔ پروژه (با _redirects)
data/projects.json             دادهٔ ۹ پروژه
services/<slug>/index.html     شش صفحهٔ خدمات
404.html                       صفحهٔ خطا
_redirects                     مسیرهای /portfolio/:slug و /services/:slug
_headers                       هدرهای امنیتی و کش Cloudflare
sitemap.xml                    نقشهٔ سایت
robots.txt                     تنظیمات موتور جستجو
site.webmanifest               تنظیمات PWA / آیکون
assets/css/style.css           استایل‌ها
assets/js/main.js              زبان، منو، reveal، شمارنده، فرم، متای صفحه
assets/js/portfolio.js         رندر و فیلتر پورتفولیو
assets/js/project.js           رندر صفحهٔ پروژه
assets/brand/                  لوگو، آیکون‌ها، favicon و og-image
assets/img/hero-bg.jpg         پس‌زمینهٔ هیرو
assets/img/portrait.jpg        تصویر بخش درباره (placeholder برند)
assets/img/projects/*.jpg      کاور پروژه‌ها
assets/img/apps/*.jpg          کاور اپلیکیشن‌ها
```

## مسیرها

| مسیر | توضیح |
| --- | --- |
| `/` | صفحهٔ اصلی |
| `/portfolio/` | فهرست نمونه‌کارها |
| `/portfolio/{slug}` | صفحهٔ پروژه؛ با `_redirects` به `project.html` rewrite می‌شود |
| `/services/web-design/` | طراحی و توسعهٔ وب |
| `/services/android-development/` | توسعهٔ اندروید |
| `/services/ui-ux-design/` | طراحی UI / UX |
| `/services/custom-software/` | نرم‌افزار اختصاصی |
| `/services/technical-consulting/` | مشاورهٔ فنی |
| `/services/engineering/` | مهندسی و سخت‌افزار |

`_redirects` باید همراه سایت آپلود شود؛ بدون آن، آدرس‌های `/portfolio/{slug}` کار نمی‌کنند.

## آپلود روی Cloudflare Pages

1. وارد <https://dash.cloudflare.com> شوید.
2. **Workers & Pages** ← **Create** ← **Pages** ← **Upload assets**.
3. نام پروژه: `toosi-app-co`.
4. ZIP نهایی را آپلود و **Deploy site** را بزنید.
5. در **Custom domains** آدرس `toosiappco.ir` را اضافه کنید.
6. برای آپدیت: **Create new deployment** و ZIP جدید.

`toosiappco.ir` زیرمجموعهٔ `app.co` است؛ بنابراین `app.co` باید در همان اکانت Cloudflare باشد تا CNAME و SSL خودکار ساخته شوند. محتوای ZIP باید در ریشه باشد؛ یعنی `index.html` در بالاترین سطح ZIP قرار دارد.

## ویرایش محتوا

### صفحهٔ اصلی
متن‌ها در `index.html` داخل `<span class="lang-fa">` و `<span class="lang-en">` قرار دارند. متای داینامیک صفحه از `data-title-fa/en` و `data-desc-fa/en` روی `<body>` خوانده می‌شود.

### پروژه‌ها
همهٔ کارت‌ها و صفحه‌های پروژه از `data/projects.json` ساخته می‌شوند. برای افزودن پروژه، یک شیء جدید با همان ساختار اضافه کنید و کاور آن را در `assets/img/projects/` بگذارید.

فیلدهای مهم: `slug`، `title_fa`، `title_en`، `description_fa`، `description_en`، `long_fa`، `long_en`، `category`، `category_fa`، `category_en`، `year`، `client_fa`، `client_en`، `role_fa`، `role_en`، `technologies`، `cover`، `gallery`، `featured`، `status_fa`، `status_en`، `projectUrl`، `storeUrl`، `seoTitle_fa`، `seoTitle_en`، `seoDescription_fa`، `seoDescription_en`.

### خدمات
هر خدمت یک صفحهٔ مستقل در `services/<slug>/index.html` دارد. متن فارسی/انگلیسی، متا، canonical و JSON-LD همان صفحه را ویرایش کنید. لینک کارت‌های صفحهٔ اصلی هم به همین مسیرها اشاره می‌کند.

## تصاویر و برند

| فایل | کاربرد | اندازهٔ فعلی |
| --- | --- | --- |
| `assets/img/hero-bg.jpg` | پس‌زمینهٔ هیرو | 1920×1080 |
| `assets/img/portrait.jpg` | بخش درباره | 900×1200 |
| `assets/img/projects/*.jpg` | کاور پروژه‌ها | 1200×900 |
| `assets/img/apps/*.jpg` | کاور اپ‌ها | 1200×900 |
| `assets/brand/og-image.jpg` | پیش‌نمایش اشتراک‌گذاری | 1200×630 |
| `assets/brand/logo.png` | لوگوی اصلی شفاف | 453×540 |
| `assets/brand/icon-*.png` + `favicon.ico` | آیکون نتایج گوگل | 16 تا 1024 |

- `assets/brand/logo.svg` یک wrapper با PNG base64 است، نه وکتور واقعی. برای وکتور واقعی، فایل SVG اصلی برند را جایگزین کنید.
- برای جایگزینی پرترهٔ واقعی، فقط `assets/img/portrait.jpg` را با همان نام و نسبت جایگزین کنید.
- تصاویر فعلی با فرمت JPG تولید شده‌اند؛ اگر WebP اضافه کردید، مسیرها را در HTML/CSS/JSON به‌روزرسانی کنید.
- فاوآیکون گوگل ممکن است روزها یا هفته‌ها بعد از ایندکس شدن به‌روز شود.

## تماس

- واتساپ: <https://wa.me/9893677781266>
- تلفن: `0936 778 1266`
- سایت محصولات: <https://boxiransilent.ir>
