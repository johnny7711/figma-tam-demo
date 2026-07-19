import { useState } from "react";
import { Flex } from "layout";
import {
  Button,
  ButtonGroup,
  Text,
  TextHeading,
  TextStrong,
  TextSubheading,
} from "primitives";
import { ProductCard } from "@demo/ui/compositions/ProductCard";
import { SizeSelector } from "@demo/ui/compositions/SizeSelector";
import { getProductById, PRODUCTS } from "@demo/data/products";
import "./productDetailPage.css";

export type ProductDetailPageProps = {
  productId: string;
  variant?: "v1" | "v2";
  onBack: () => void;
};

export function ProductDetailPage({
  productId,
  variant = "v1",
  onBack,
}: ProductDetailPageProps) {
  const product = getProductById(productId);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  if (!product) {
    return (
      <div className="demo-shell">
        <Text>Product not found.</Text>
        <Button variant="subtle" onPress={onBack}>
          Back to listing
        </Button>
      </div>
    );
  }

  const isV2 = variant === "v2";
  const recommendations = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="demo-shell">
      <Flex direction="column" gap="600">
        <button className="pdp-back" onClick={onBack}>
          ← Back
        </button>

        <div className="pdp-grid">
          <div className="pdp-media">
            <img src={product.imageUrl} alt={product.name} />
          </div>

          <Flex direction="column" gap="400" style={{ padding: "var(--sds-size-space-400)" }}>
            <Flex direction="column" gap="200">
              <Text>{product.category}</Text>
              <TextHeading>{product.name}</TextHeading>
              <TextStrong>¥{product.price}</TextStrong>
            </Flex>

            <Text>{product.description}</Text>

            <SizeSelector value={selected} onChange={setSelected} />

            <ButtonGroup align="stack">
              <Button
                variant="primary"
                size="medium"
                onPress={() => console.log("bag", product.id, selected)}
              >
                Add to bag
              </Button>
              <Button variant="subtle" size="medium">
                Save for later
              </Button>
            </ButtonGroup>
          </Flex>
        </div>

        {isV2 && (
          <section className="pdp-recommendations">
            <Flex direction="column" gap="400">
              <TextSubheading>You may also like</TextSubheading>
              <div className="pdp-recommendations-grid">
                {recommendations.map((p) => (
                  <ProductCard
                    key={p.id}
                    name={p.name}
                    category={p.category}
                    price={p.price}
                    badge={p.badge}
                    imageUrl={p.imageUrl}
                    onAddToBag={() => console.log("add", p.id)}
                  />
                ))}
              </div>
            </Flex>
          </section>
        )}
      </Flex>
    </div>
  );
}
