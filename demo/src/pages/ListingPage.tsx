import { Flex } from "layout";
import { TextHeading, TextSubheading } from "primitives";
import { ProductCard } from "@demo/ui/compositions/ProductCard";
import { PRODUCTS } from "@demo/data/products";
import "./listingPage.css";

export type ListingPageProps = {
  onOpenProduct: (id: string) => void;
};

export function ListingPage({ onOpenProduct }: ListingPageProps) {
  return (
    <div className="demo-shell">
      <Flex direction="column" gap="600">
        <Flex direction="column" gap="200">
          <TextHeading>Men's Sneakers</TextHeading>
          <TextSubheading>Fresh drops · {PRODUCTS.length} styles</TextSubheading>
        </Flex>

        <div className="listing-toolbar">
          <div className="listing-toolbar-chips">
            <span className="listing-chip listing-chip-active">All</span>
            <span className="listing-chip">Running</span>
            <span className="listing-chip">Lifestyle</span>
            <span className="listing-chip">Outdoor</span>
            <span className="listing-chip">Training</span>
          </div>
          <div className="listing-toolbar-sort">Sort: Newest</div>
        </div>

        <div className="listing-grid">
          {PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              category={p.category}
              price={p.price}
              badge={p.badge}
              imageUrl={p.imageUrl}
              onOpen={() => onOpenProduct(p.id)}
              onAddToBag={() => console.log("add", p.id)}
            />
          ))}
        </div>
      </Flex>
    </div>
  );
}
