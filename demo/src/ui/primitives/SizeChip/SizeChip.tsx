import clsx from "clsx";
import { Button as RACButton } from "react-aria-components";
import "./sizeChip.css";

export type SizeChipState = "Available" | "Selected" | "Sold out";

export type SizeChipProps = {
  size: string;
  state?: SizeChipState;
  onSelect?: (size: string) => void;
};

export function SizeChip({
  size,
  state = "Available",
  onSelect,
}: SizeChipProps) {
  const isSoldOut = state === "Sold out";
  const isSelected = state === "Selected";
  return (
    <RACButton
      className={clsx(
        "size-chip",
        isSelected && "size-chip-selected",
        isSoldOut && "size-chip-sold-out",
      )}
      isDisabled={isSoldOut}
      aria-pressed={isSelected}
      onPress={() => onSelect?.(size)}
    >
      {size}
    </RACButton>
  );
}
