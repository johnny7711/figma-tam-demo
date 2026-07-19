// url=<FIGMA_PRODUCT_CARD>
/**
 * figma.config.jsonのdocumentUrlSubstitutionsのキーで紐付けられているURLを参照
 * "<FIGMA_PRODUCT_CARD>": "https://www.figma.com/design/0i6zwcTEIIePCADDL5fDTZ/DEMO_prep?node-id=12-325"
 */
import figma from "figma";

const name = figma.selectedInstance.getString("Name");
const category = figma.selectedInstance.getString("Category");
const price = figma.selectedInstance.getString("Price");
const rating = figma.selectedInstance.getString("Rating");
const badge = figma.selectedInstance.getEnum("Badge", {
  New: "New",
  Sale: "Sale",
  "Sold out": "Sold out",
  None: "None",
});

// Nested SDS Button instance whose layer name is "Add to bag"
const addToBag = figma.selectedInstance.findInstance("Add to bag");
const addToBagTemplate =
  addToBag.type === "INSTANCE" ? addToBag.executeTemplate() : undefined;

/**
 * figma.codeでCodeConnectに表示する文字列を設定
 */
export default {
  example: figma.code`
  <ProductCard
  name="${name}"
  category="${category}"
  price="${price}"
  rating={Number("${rating}")}
  badge="${badge}"
  imageUrl="/product.jpg"
  onAddToBag={() => {}}
  >
  ${addToBagTemplate?.example ?? ""}
</ProductCard>`,
  imports: ['import { ProductCard } from "@demo/ui/compositions/ProductCard"'],
  id: "demo/ProductCard",
  metadata: { nestable: false },
};
