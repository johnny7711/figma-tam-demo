import { Flex } from "layout";
import { TextStrong } from "primitives";
import { SizeChip, SizeChipState } from "../../primitives/SizeChip";
import "./sizeSelector.css";

export const SAMPLE_SIZES: { size: string; state: SizeChipState }[] = [
  { size: "25.0", state: "Available" },
  { size: "25.5", state: "Available" },
  { size: "26.0", state: "Available" },
  { size: "26.5", state: "Sold out" },
  { size: "27.0", state: "Available" },
  { size: "27.5", state: "Available" },
  { size: "28.0", state: "Sold out" },
  { size: "28.5", state: "Available" },
  { size: "29.0", state: "Available" },
  { size: "30.0", state: "Available" },
];

export type SizeSelectorProps = {
  sizes?: { size: string; state: SizeChipState }[];
  value?: string;
  onChange?: (size: string) => void;
};

export function SizeSelector({
  sizes = SAMPLE_SIZES,
  value,
  onChange,
}: SizeSelectorProps) {
  return (
    <Flex direction="column" gap="200">
      <TextStrong>Select size (US)</TextStrong>
      <div className="size-selector-grid">
        {sizes.map(({ size, state }) => (
          <SizeChip
            key={size}
            size={size}
            state={state === "Sold out" ? "Sold out" : value === size ? "Selected" : "Available"}
            onSelect={onChange}
          />
        ))}
      </div>
    </Flex>
  );
}
