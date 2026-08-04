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
│   ├── js/main.js          # メニュー・Reveal・スクロールスパイ・進捗バー
│   ├── fonts/              # セルフホストのサブセット woff2（外部フォント不使用）
│   └── img/
│       ├── 01_05.jpg       # ヒーロー元画像（最適化のソース。配信はしない）
│       ├── hero-1600.*     # ヒーロー（PC）WebP + JPGフォールバック
│       ├── hero-960.*      # ヒーロー（モバイル）
│       ├── ogp.jpg         # SNSシェア用 OGP 画像（1200×630）
│       └── favicon.svg     # ファビコン
├── scripts/
│   ├── optimize-images.mjs # 画像最適化スクリプト（sharp）
│   ├── fetch-font-src.sh   # サブセット元フォント（OFL）の取得
│   └── build-fonts.py      # フォントのサブセット化（fonttools）
├── robots.txt / sitemap.xml
├── .nojekyll               # GitHub Pages の Jekyll 処理を無効化
└── README.md
```

## Sections

- **Hero** — 左に見出し・右に自社便の写真を置いた分割構成（写真に暗幕をかけない）
- **Trust strip** — ヒーロー直下に主要取引先を1行で提示
1. **About** — 3つの軸（Direct / Multiple / Trust）
2. **Business** — 4事業
   - 01: 生鮮食品の直送便
   - 02: 野菜・果物販売
   - 03: 人材紹介・ビジネスマッチング支援
   - 04: お墓お掃除代行サービス
3. **Direct** — 一般流通（6ノード）と自社直送（4ノード）を並べた比較図
4. **Clients** — JR東日本・イオン・セブン&アイ ほか
5. **Message** — 代表メッセージ
6. **Team** — 6つの役割（Roles）
7. **Company** — 会社概要
8. **Contact** — メール窓口・受付時間

## Design

「運ぶ会社の誠実さ」。装飾を削ぎ、余白・階層・実績で信頼をつくる方向。

- カラー: ネイビー (#0d2f63 / 企業の芯) ／ パイングリーン (#17624a / 産地の芯) ／ 白・温白 (#ffffff / #f6f5f1) ／ インク (#14181d)。アクセントは2色のみ
- フォント: Noto Sans JP / Inter / JetBrains Mono（**セルフホスト・日本語サブセット化済み**）
  - Inter・JetBrains Mono は CJK を持たないため、フォールバックに Noto Sans JP を挟んで和欧混在ラベルもシステムフォントに落ちないようにしている
- 構成: 全セクション左端そろえ、ヘアラインと連番による編集的な階層づけ
- 撤去したもの: ローダー、マーキー、グレイン、パララックス、事業セクションのグラデーション板

## Motion

`transform` / `opacity` / `clip-path` のみを使い、コンポジタ上で完結させています。

- **ヒーロー** — CSS キーフレームで即時開始（JS 待ちの「一瞬見えて消える」を起こさない）。見出しは行ごとのマスクからせり上がり、写真は **opacity を触らずスケールのみ** なので LCP 計測に影響しません
- **見出し** — `clip-path` で下から上へワイプ。※ クリップされた要素は画面内でも `intersectionRatio` が 0 を返すため、**トリガーはクリップされていない親要素**に置いています
- **カード・リスト** — JS が `--i` を配って `transition-delay` でカスケード
- **流通図** — ノードが1つずつ、矢印を挟んで順に出現（「6ホップ対4ホップ」の差を時間で見せる）
- **数字** — `4` / `200` がカウントアップ（`tabular-nums` で桁送りのガタつきを防止）
- **ホバー** — 取引先行のグリーンバー、事業番号の浮き上がり、チップ・ロールカードの反応

安全側の設計:

- `prefers-reduced-motion: reduce` で **全アニメーション停止**（`animation-delay` / `transition-delay` も 0 に）
- 初期状態の「非表示」は **すべて JS がクラスを付与して初めて成立**。JS が失敗・無効でもページは完全に見えます（`main.js` をブロックして検証済み）

## 画像の再生成

ヒーロー画像・OGP画像は `assets/img/01_05.jpg` を元に [sharp](https://sharp.pixelplumbing.com/) で生成しています。

```bash
npm install sharp           # 初回のみ（node_modules は .gitignore 済み）
node scripts/optimize-images.mjs
```

WebP + JPGフォールバックのレスポンシブ画像と、1200×630 の OGP 画像を `assets/img/` に出力します。

## フォントの再生成

ページ内の実テキストから字形を集計し、各可変フォントを woff2 にサブセットしてセルフホストしています（可変軸 `wght` は保持）。Google Fonts への外部リクエストはありません。

```bash
pip install fonttools brotli   # 初回のみ
bash scripts/fetch-font-src.sh # 元フォント(OFL)を /tmp に取得
python3 scripts/build-fonts.py # assets/fonts/*.woff2 を生成
```

> 日本語コピーを大きく変更した場合は再生成してください。ひらがな・カタカナ・常用記号は安全マージンとして全字含めているため、軽微な編集ではフォールバックしません。

## パフォーマンス / SEO / アクセシビリティ

- ヒーロー写真は WebP 化＋レスポンシブ配信で **604KB → 約57KB（PC, WebP）** に圧縮。`fetchpriority="high"` ＋ `aspect-ratio` による領域確保で LCP と CLS を両立
- フォントはセルフホスト＋日本語サブセットで **Noto Sans JP 9.6MB → 約188KB**（3書体合計 約260KB）。外部フォントリクエストをゼロ化し、`font-display: swap` ＋ critical face を preload
- Open Graph / Twitter Card / canonical / JSON-LD（Organization）構造化データを設定
- スキップリンク、`:focus-visible` のキーボードフォーカス表示、`aria-current` 付きスクロールスパイ、`prefers-reduced-motion` 対応、Esc でメニューを閉じる
- **本文テキストは全て WCAG AA（4.5:1、大文字は3:1）を満たすことを実測で確認済み**
- 1440 / 1280 / 1100 / 900 / 820 / 390px で横スクロール発生なしを確認済み
