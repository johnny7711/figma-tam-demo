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
import "./pdpWithRecPage.css";

export type PdpWithRecPageProps = {
  productId: string;
  onBack: () => void;
};

const RECOMMENDATION_IDS = [
  "court-classic-70",
  "trail-crest-mid",
  "studio-flex-lo",
];

export function PdpWithRecPage({ productId, onBack }: PdpWithRecPageProps) {
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

  const recommendations = RECOMMENDATION_IDS.map((id) =>
    PRODUCTS.find((p) => p.id === id),
  ).filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

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

          <Flex
            direction="column"
            gap="400"
            style={{ padding: "var(--sds-size-space-400)" }}
          >
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

        {/* Recommendation section using ProductCard (Code Connect wired). */}
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

        {/* Recommendation section rendered as flat markup — how MCP output
            looks WITHOUT Code Connect, i.e. no reuse of ProductCard. */}
        <section className="pdp-recommendations">
          <Flex direction="column" gap="400">
            <TextSubheading>You may also like</TextSubheading>
            <div className="pdp-rec-flat-grid">
              {recommendations.map((p) => (
                <article key={p.id} className="pdp-rec-flat-card">
                  <div className="pdp-rec-flat-media">
                    <img src={p.imageUrl} alt={p.name} />
                    {p.badge === "Sale" && (
                      <span className="pdp-rec-flat-badge">Sale</span>
                    )}
                  </div>
                  <div className="pdp-rec-flat-content">
                    <p className="pdp-rec-flat-category">{p.category}</p>
                    <p className="pdp-rec-flat-name">{p.name}</p>
                    <p className="pdp-rec-flat-price">¥{p.price}</p>
                    <div className="pdp-rec-flat-cta">
                      <button
                        type="button"
                        onClick={() => console.log("add", p.id)}
                      >
                        Add to bag
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Flex>
        </section>
      </Flex>
    </div>
  );
}
