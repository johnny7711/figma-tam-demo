// url=<FIGMA_SIZE_SELECTOR>
// SizeSelector is a composition — no Figma-level properties.
// The 10 SizeChip instances inside are provided by code via the SAMPLE_SIZES
// default (or by the `sizes` prop). Value/onChange handle interactive state.
import figma from "figma";

export default {
  example: figma.code`<SizeSelector value={selectedSize} onChange={setSelectedSize} />`,
  imports: [
    'import { SizeSelector } from "@demo/ui/compositions/SizeSelector"',
  ],
  id: "demo/SizeSelector",
  metadata: { nestable: false },
};
