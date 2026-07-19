# Code Connect Sync Demo

Nike TAM Dev Mode Enablement のロールプレイで使う、
「実装 PR → Claude が Code Connect の追従 PR を自動作成」の裏側メモ。

## Story

1. Frontend dev が `ProductCard.tsx` に新 prop `rating` を足した PR を開く
2. GitHub Actions が `pull_request` イベントで発火
3. `anthropics/claude-code-action@v1` が Claude Code を起動
4. Claude が `ProductCard.tsx` と `ProductCard.figma.ts` を突き合わせ、drift を検出
5. Claude が `sync-cc/<original-branch>` を切って `.figma.ts` を編集・push
6. Claude が元 PR の head branch を base にしたスタック PR を作成
7. 元 PR にコメントで sync PR の URL を通知

## One-time setup

### Repository secrets

```bash
gh secret set ANTHROPIC_API_KEY --repo johnny7711/figma-tam-demo
```

### Workflow permissions

Settings → Actions → General → Workflow permissions を
**Read and write** に変更。これで Claude が commit と PR 作成できる。

## Demo script

以下は面接当日の想定シナリオ。

### 事前準備（オフライン）

- Figma UI Kit 側の `ProductCard` に **Rating** テキストプロパティを追加しておく
  (Figma 側の Property Panel で新規プロパティ追加 → Text 型 → 名前 `Rating`)
- ローカルで `feat/product-card-rating` ブランチを用意しておくと安全

### ライブ実演

```bash
# 1. 新 prop を追加した実装 PR を用意
git checkout -b feat/product-card-rating

# demo/src/ui/compositions/ProductCard/ProductCard.tsx を編集:
#   - props に `rating?: number` を追加
#   - JSX に <span className="product-card-rating">★ {rating}</span> を追加

git add demo/src/ui/compositions/ProductCard/
git commit -m "feat(product-card): add rating prop"
git push -u origin feat/product-card-rating

# 2. PR を open（ここが CI 発火トリガー）
gh pr create --title "feat: ProductCard に rating prop を追加" --body "実装のみ"

# 3. Actions タブで sync-code-connect ジョブが動くのを見せる
gh run watch

# 4. 数分後、Claude が open した sync PR を見せる
gh pr list --author "claude-code[bot]"
```

## Trigger 仕様

- `pull_request` の `opened` / `synchronize` / `reopened`
- Path filter: `demo/src/ui/**/*.tsx`
- ブランチ名が `sync-cc/*` の場合はスキップ（self-loop 防止）

## Claude に渡している prompt の要点

- 変更された `.tsx` をリストアップ
- `demo/src/figma/` の対応する `.figma.ts` と比較
- drift があれば **props → getString/getEnum/getBoolean マッピング** を修正
- スニペット（`figma.code\`\`` 内）も更新
- 変更なしなら早期終了
- 新ブランチ push、スタック PR 作成、元 PR にコメント

詳細は `.github/workflows/sync-code-connect.yml` の `prompt:` を参照。

## 失敗しやすいポイント

- **Workflow permissions が read-only**: Claude の push が 403 で落ちる → Settings で write に
- **ANTHROPIC_API_KEY 未登録**: action の最初のステップで即失敗
- **Figma property 名の推測ミス**: prompt は「code prop を PascalCase 化」と決め打ちしている。
  実際の Figma property 名が違うと sync PR は正しくならない → 手動修正が必要
- **`sync-cc/<branch>` が既に存在**: rerun 時に upsert 挙動（`checkout -B` + `push --force-with-lease`）で対応

## Trade-offs / 語り

Nike が聞いてきそうな質問と回答例:

- **Q: 誤った sync PR を出す可能性は？**
  A: あります。だから別 PR にして人間レビューを挟みます。実装 PR とは独立に revert 可。
- **Q: 200+ コンポーネントでスケールする？**
  A: この workflow は変更されたファイルだけを見るので O(diff)。全件走査ではありません。
- **Q: Figma 側の変更駆動は？**
  A: 逆方向（Figma → code）は今回の workflow の対象外。それは Dev Mode + MCP の役割。
