import { Flex } from "layout";
import { Button, Tag, Text, TextStrong, TextSubheading } from "primitives";
import "./productCard.css";

export type ProductCardBadge = "None" | "New" | "Sale" | "Sold out";

export type ProductCardProps = {
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  badge?: ProductCardBadge;
  rating?: number;
  onAddToBag?: () => void;
  onOpen?: () => void;
};

const badgeToScheme: Record<
  Exclude<ProductCardBadge, "None">,
  "brand" | "danger" | "neutral"
> = {
  New: "brand",
  Sale: "danger",
  "Sold out": "neutral",
};

export function ProductCard({
  name,
  category,
  price,
  imageUrl,
  badge = "None",
  rating,
  onAddToBag,
  onOpen,
}: ProductCardProps) {
  const isSoldOut = badge === "Sold out";
  return (
    <article className="product-card">
      <button className="product-card-media" onClick={onOpen} aria-label={`Open ${name}`}>
        <img src={imageUrl} alt={name} />
        {badge !== "None" && (
          <span className="product-card-badge">
            <Tag scheme={badgeToScheme[badge]} variant="primary">
              {badge}
            </Tag>
          </span>
        )}
      </button>
      <Flex direction="column" gap="100" style={{ padding: "var(--sds-size-space-400)" }}>
        <Text>{category}</Text>
        <TextSubheading lineClamp={1}>{name}</TextSubheading>
        {rating !== undefined && (
          <span className="product-card-rating" aria-label={`Rating ${rating} out of 5`}>
            ★ {rating.toFixed(1)}
          </span>
        )}
        <TextStrong>¥{price}</TextStrong>
        <div className="product-card-cta">
          <Button
            variant="primary"
            size="medium"
            isDisabled={isSoldOut}
            onPress={onAddToBag}
          >
            Add to bag
          </Button>
        </div>
      </Flex>
    </article>
  );
}
