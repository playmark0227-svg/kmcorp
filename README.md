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
├── index.html              # メインページ
├── assets/
│   ├── css/style.css       # スタイル一式
│   ├── js/main.js          # スクロール演出・メニュー等
│   └── img/favicon.svg     # ファビコン
├── .nojekyll               # GitHub Pages の Jekyll 処理を無効化
└── README.md
```

## Sections

1. **Hero** — 那須塩原の自然をベースにしたフルスクリーンヒーロー
2. **About** — 3つの価値（Direct / Trust / Care）
3. **Business** — 4事業
   - Service 01: 生鮮食品の直送便
   - Service 02: 野菜・果物販売
   - Service 03: 人材紹介・ビジネスマッチング支援
   - Service 04: お墓お掃除代行サービス
4. **Flow** — 中間流通を省いたダイレクト供給フロー
5. **Clients** — JR東日本・イオン・セブン&アイ ほか
6. **Company** — 会社概要
7. **Contact** — お問い合わせ

## Design

- カラー: 深いブルー (#0b3d91) ／ クリーム (#faf7f2) ／ 自然グリーン (#5e8c4a) ／ ゴールド (#f2cf78)
- フォント: Noto Serif JP / Noto Sans JP / Cormorant Garamond / Inter
- モチーフ: 編集デザイン的なナンバリング、和欧混植、余白を活かした上品な構成
- 演出: ローダー、IntersectionObserver による Reveal、パララックス、マーキー
