# 國耘有限公司 Gewinnen LTD. 官方網站

Jekyll 靜態網站，中文（`/`）與英文（`/en/`）雙語。

## 目錄結構

```
_config.yml        網站設定（語言預設、collections）
_data/             company.yml 公司資訊・navigation.yml 選單・i18n.yml 介面文字
_includes/         共用元件（header、footer、SEO、breadcrumbs…）
_layouts/          版型：home、page、services、cases、case、news、post、faq、contact、hub
_sass/             樣式分檔，由 assets/css/main.scss 編譯為 main.css
_cases/            工程實績（中文；英文放 _cases/en/）
_posts/zh|en/      最新消息
pages/zh|en/       各頁面內容（網址由 permalink 決定）
pages/             404.html、sitemap.xml、robots.txt
assets/css|js/     樣式入口與互動腳本
assets/image/      圖片：brand、home、services、cases/<案例>
```

## 撰寫內容

- 內容一律使用 Markdown，不寫 HTML／CSS；版面由 `layout` 決定，結構化資料（服務、FAQ、案例特色、圖庫）寫在前置資料。
- 中英文對應頁面使用相同的 `ref`，語言切換與 hreflang 會自動對應。
- 新增案例：複製 `_cases/` 內既有檔案修改；英文版放 `_cases/en/`。

## 本機預覽

```
bundle install
bundle exec jekyll serve
```
