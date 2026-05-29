# 株式会社KMコーポレーション ｜ Renewal Site

那須塩原から、新鮮を、まっすぐに。
PDF事業案内をベースに、デザイン重視でリニューアルした静的サイトです。

## Preview

GitHub Pages で公開中:
**<https://playmark0227-svg.github.io/kmcorp/>**

> 初回反映には数分かかる場合があります。設定: Repository Settings → Pages → Branch: `claude/redesign-kmcorp-site-yRhum` / `/ (root)`

ローカルプレビュー:

```bash
# 任意の静的サーバでOK
python3 -m http.server 8080
# → http://localhost:8080
```

## Structure

```
.
├── index.html              # メインページ（1ページ完結）
├── assets/
│   ├── css/style.css       # スタイル一式
│   ├── js/main.js          # ローダー・メニュー・Reveal・スクロールスパイ等
│   └── img/
│       ├── 01_05.jpg       # ヒーロー元画像（最適化のソース。配信はしない）
│       ├── hero-1600.*     # ヒーロー（PC）WebP + JPGフォールバック
│       ├── hero-960.*      # ヒーロー（モバイル）
│       ├── ogp.jpg         # SNSシェア用 OGP 画像（1200×630）
│       └── favicon.svg     # ファビコン
├── scripts/
│   └── optimize-images.mjs # 画像最適化スクリプト（sharp）
├── robots.txt / sitemap.xml
├── .nojekyll               # GitHub Pages の Jekyll 処理を無効化
└── README.md
```

## Sections

1. **Hero** — 自社便とドライバーの写真をベースにしたフルスクリーンヒーロー
2. **About** — 3つの軸（Direct / Multi / Trust）
3. **Voice** — 代表メッセージ（マニフェスト型）
4. **Business** — 4事業
   - Service 01: 生鮮食品の直送便
   - Service 02: 野菜・果物販売
   - Service 03: 人材紹介・ビジネスマッチング支援
   - Service 04: お墓お掃除代行サービス
5. **Direct** — 中間流通を省いたダイレクト供給フロー
6. **Team** — 6つの役割（Roles）
7. **Clients** — JR東日本・イオン・セブン&アイ ほか
8. **Company / Contact**

## Design

- カラー: ブランドブルー (#0b3d91) ／ クリーム (#f4f1ea) ／ シグナルオレンジ (#ff5a1f) ／ ポップイエロー (#ffd93d) ／ チャコール (#14171c)
- フォント: Noto Sans JP / Inter / JetBrains Mono
- モチーフ: 産業・物流的なナンバリング、和欧混植、余白とラインを活かした構成
- 演出: ローダー、IntersectionObserver による Reveal、ヒーローのパララックス、マーキー、スクロール進捗バー、ナビのスクロールスパイ

## 画像の再生成

ヒーロー画像・OGP画像は `assets/img/01_05.jpg` を元に [sharp](https://sharp.pixelplumbing.com/) で生成しています。

```bash
npm install sharp           # 初回のみ（node_modules は .gitignore 済み）
node scripts/optimize-images.mjs
```

WebP + JPGフォールバックのレスポンシブ画像と、1200×630 の OGP 画像を `assets/img/` に出力します。

## パフォーマンス / SEO / アクセシビリティ

- ヒーロー写真は WebP 化＋レスポンシブ配信で **604KB → 約57KB（PC, WebP）** に圧縮、`<link rel="preload">` で LCP を前倒し
- Google Fonts は `preload` + 非ブロッキング読み込み（`noscript` フォールバックあり）
- Open Graph / Twitter Card / canonical / JSON-LD（Organization）構造化データを設定
- スキップリンク、`:focus-visible` のキーボードフォーカス表示、`aria-current` 付きスクロールスパイ、`prefers-reduced-motion` 対応
