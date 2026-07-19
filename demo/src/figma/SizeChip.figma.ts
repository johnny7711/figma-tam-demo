// url=<FIGMA_SIZE_CHIP>
// Walkthrough target: this file is opened live during Beat 4 to explain
// how Figma properties map to code props via the template-file API.
import figma from "figma";

const size = figma.selectedInstance.getString("Size");
const state = figma.selectedInstance.getEnum("State", {
  Available: "Available",
  Selected: "Selected",
  "Sold out": "Sold out",
});

export default {
  example: figma.code`<SizeChip
  size="${size}"
  state="${state}"
  onSelect={(size) => setSelected(size)}
/>`,
  imports: ['import { SizeChip } from "@demo/ui/primitives/SizeChip"'],
  id: "demo/SizeChip",
  metadata: { nestable: true },
};
