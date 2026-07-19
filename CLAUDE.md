# Figma TAM — Dev Mode Enablement デモ準備コンテキスト

> Claude Code に渡す作業用ブリーフ。これまでの検討をまとめたもの。
> ゴール:60分ロールプレイで使う **Figmaデザイン＋コード＋Code Connect** の素材を用意する。
> 方針:**最小構成**で作り、**write-to-canvasで生成 → 名前合わせで仕上げる**。

---

## 1. 面接シナリオ / 前提

- 形式:**Dev Mode Enablement ロールプレイ(60分)**。相手は **Nike の VP of Engineering ＋ エンジニアチーム**。
- 要求:**slides ＋ product を併用**し、Designer と Developer 両方の体験を end-to-end で見せる。
  自分たちの実コードを **Code Connect** で Figma に持ち込む nuance、および **Dev Mode MCP Server**
  が design-to-code をどう賢くするか(特に **Code Connect が MCP のコンテキストを豊かにする**)を示す。
- 着地させる3成果:**(1)デザイン/開発間のコミュニケーション明確化 (2)デザインシステム採用・品質向上 (3)開発者ワークフロー効率化**。
- 評価軸:**creativity＋product knowledge**(＝プレゼン自体もFigmaで作る)/ **audience adaptability**(エンジニア向けに深く)/ **customer success**(質問・反論への対応)。
- Designer側で触れる必須項目:ページ構成、フロー用Section、レイヤー命名、注釈、Ready for Dev＋コメント。
- Developer側で触れる必須項目:Ready for Dev status、Workflow/Focus view、Compare changes、Versioning、Component playground、**Code Connect 実装と価値**、**VS Code**、**MCP Server**。

## 2. デモの筋書き(6ビート)

1. **WHY(slides)** — Dev Mode とエージェント連携の潮流。Figma Slidesで作る。
2. **Designer ハンドオフ** — 一覧/詳細で作法(Section・命名・注釈・Ready for Dev・トークン)。
3. **Dev Mode に入る** — status/Focus view/Compare changes/Versioning/Component playground。
4. **Code Connect 深掘り** — template file を解説しながら publish。**同じコンポーネントを inspect して before/after** で「snippetが自社コードになる」。
5. **VS Code ＋ MCP(crescendo)** — フレームを IDE に渡してコード生成。**Code Connect あり/なし**を比較(あり=自社`<ProductCard>`/`<SizeChip>`再利用、なし=汎用自作)。
6. **3成果に着地(slides)**。

補足:
- **direction は Figma → code が主役**(これがシナリオの本題)。**code → Figma(write to canvas)はデモしない**(準備の近道としてのみ使う。§6)。
- 「Code Connect でページが湧く」ではない。ページ生成は Dev Mode inspect / MCP の仕事。Code Connect は
  **生成が自社の実部品を再利用するよう文脈を与える**役割。ここを正確に。

## 3. 作る素材(最小構成 — 複雑にしない)

- **一覧ページ**:簡易ヘッダー ＋ **ProductCard を 4〜6枚**のグリッド。ソート/フィルタは飾り程度でよい。
- **詳細ページ(PDP)**:画像1枚 ＋ 商品名/価格 ＋ **SizeSelector** ＋ 「Add to bag」Button。
- **v2**:詳細を複製して**変更を1つだけ**(例:Buttonのvariant変更 or バッジ追加)。Compare/Versioning用。
- テーマ:スニーカーEC(atmos を**見た目の参考**にするのみ。要素は真似ない。ブランドは架空で可)。

## 4. コンポーネントと命名 ← Code Connect の生命線

Code Connect は **プロパティ名/レイヤー名の完全一致**で紐づく。Figma側をこの表に合わせる。

| コンポーネント | Figmaプロパティ | Variant値 | 備考 |
|---|---|---|---|
| **ProductCard** | `Name` / `Category` / `Price`(text) | `Badge` = `New` / `Sale` / `Sold out` | 中のButtonインスタンスの**レイヤー名=`Add to bag`** |
| **SizeChip** | `Size`(text, 例"27.0") | `State` = `Available` / `Selected` / `Sold out` | 深掘りウォークスルーの主役 |
| **SizeSelector** | — | — | SizeChipインスタンスを並べたcomposition。数個を`Sold out`に |
| **Button / Tag** | (SDS既定) | (SDS既定) | **SDS既存を再利用**。個別に接続し直さない |

## 5. コード / リポジトリ

- ベース:**`figma/sds`** を clone(`src/ui`=コンポーネント、`src/figma`=Code Connect、`src/stories`=Storybook)。
- **Code Connect は template files(parserless)形式**を使う。legacy React SDK 形式は使わない。
- 用意済みファイル(このフォルダ):
  - `src/ui/compositions/ProductCard.tsx`
  - `src/ui/primitives/SizeChip.tsx`
  - `src/ui/compositions/SizeSelector.tsx`(`SAMPLE_SIZES`含む)
  - `src/figma/ProductCard.figma.ts`(nested instance の例)
  - `src/figma/SizeChip.figma.ts`(**深掘りウォークスルー用** — getString/getEnum/onSelect)
  - `figma.config.json`(`include: src/figma/**/*.figma.ts`)
- import パスは自分の sds clone に合わせて調整すること。

### template file の解剖(walkthrough用の要点)
- 冒頭 `// url=` … 紐づけ先のFigmaコンポーネント(Copy link to selection)。`source`/`component`は任意表示。
- `figma.selectedInstance.getString()/getEnum()/getBoolean()` … Figmaプロパティ→コード値のマッピング。
- nested:`instance.findInstance("Add to bag").executeTemplate().example` で接続済み子の snippet を差し込む。
- `export default { example: figma.code\`...\`, imports, id, metadata:{nestable} }`。**snippetは必ず`figma.code\`\``で包む(文字列連結禁止)**。

## 6. ビルド手順(Claude Code)

### 6-1. セットアップ(一度だけ)
- **remote Figma MCP server** を使う。**Full シート**が必要(Devシートはドラフト外read-only → その場合は自分のドラフトで生成しTeamへMove)。
- 生成先ファイルで **SDSライブラリを有効化**(Button/Tagを再利用させるため)。
- Claude Code に Figma プラグイン導入(MCPサーバー＋スキルが入る):
  ```bash
  claude plugin install figma@claude-plugins-official
  ```

### 6-2. 生成(write-to-canvas スキル)
- `figma-generate-library`:コードからFigmaコンポーネントを生成。プロンプト例:
  > Using my design system, create Figma components for `ProductCard`, `SizeChip`, and `SizeSelector`
  > from `src/ui`. Reuse the existing SDS Button and Tag from the library for nested pieces.
  > Give ProductCard properties Name/Category/Price and a Badge variant (New/Sale/Sold out).
  > Give SizeChip a Size text property and a State variant (Available/Selected/Sold out).
- `figma-generate-design`:部品を使ってページを生成。プロンプト例:
  > Using SDS plus the ProductCard and SizeSelector components, build two simple screens:
  > a product listing with a grid of 4–6 ProductCards, and a product detail page with an image,
  > name/price, a SizeSelector, and an "Add to bag" button. Keep it minimal.

### 6-3. 調整 ← ここが価値の本体(見た目でなく"名前合わせ")
- 生成物のプロパティ/レイヤー名を **§4の表に一致**させる(違えばリネーム)。
- ProductCard内のButtonが **SDS Buttonの本物インスタンス**か / 色・余白が **SDS変数にバインド**されているか / Auto Layout が効いているか を確認。
- 生成はベータ。**一発では終わらない前提**でcleanupする。

### 6-4. 接続(publish)
- 各Figmaコンポーネントの「Copy link to selection」を template file の `// url=` に入れる(または SDS流に `documentUrlSubstitutions` で一括)。
- publish:
  ```bash
  npx figma connect publish --token=<支給されたPAT>
  ```
  ※ PATの値はリソースframe参照。**このファイルには書かない**。
- Dev Mode で該当インスタンスを inspect → **自社コード＋import** が出れば成功。

## 7. ハンドオフ作法(画面が単純でも必ず入れる)

作法自体が採点対象。シンプルな画面ほどきれいに映える。
- ページ分割:`Cover` / `Product Flow` / `Explorations` / `Handoff notes`
- 一覧/詳細を **Section** で囲み機能名を付け、プロト矢印で**フロー**に
- レイヤー/フレームを意味ある名前に(AI rename も一言)
- 主要コンポーネントに**注釈**(余白・状態・挙動)
- Section を **Ready for Dev** にして**コメント**を1つ
- 色/余白/タイポは **SDS変数** でバインド(Inspectでトークン名を出す)

## 8. 落とし穴 / 原則

- **名前一致が全て**(§4)。ここを外すとpublishしても緑にならない。
- **before(未接続)は事前にスクショ/録画**。ライブでの unpublish は詰まりやすい。publish だけライブが安全。
- **シンプルに保つ**。要素を増やすほど調整・尺・差分の見づらさが増える。
- **code→Figma(write to canvas)は準備の近道であって、デモの主役にしない**。
- **Chrome拡張 / code-to-canvas(generate_figma_design)はフラットなレイヤー**でCode Connect不可 → atmos取り込みは**見た目参考のみ**。
- **over-promiseしない**:「AIがページを完成」ではなく「自社システムに沿った正しい**出発点**を生成」。VP相手はこの誠実さが加点。

## 9. 提供済みリソース(面接資料より)

- **Simple Design System (SDS)**:Figma Community の UI Kit ＋ GitHub `figma/sds`(Code Connect設定済み、`documentUrlSubstitutions`使用)。
- **PAT**:Code Connect publish 用(2026年9月まで有効)。値はリソースframe参照。
- **TAM Dev Mode Pitch slides**(パスワード付き):WHY のenablementスライドに転換して使う。
- Recruitment Organization 内に **Team** が提供される。ファイルはそこに作る。
