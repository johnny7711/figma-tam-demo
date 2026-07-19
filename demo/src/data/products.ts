import type { ProductCardBadge } from "@demo/ui/compositions/ProductCard";

export type DemoProduct = {
  id: string;
  name: string;
  category: string;
  price: string;
  badge: ProductCardBadge;
  imageUrl: string;
  description: string;
};

export const PRODUCTS: DemoProduct[] = [
  {
    id: "aero-lite-01",
    name: "AeroLite Runner 01",
    category: "Running",
    price: "18,900",
    badge: "New",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    description:
      "Ultra-cushioned trainer built for daily miles. Breathable engineered mesh keeps you cool over long runs.",
  },
  {
    id: "court-classic-70",
    name: "Court Classic '70",
    category: "Lifestyle",
    price: "14,300",
    badge: "None",
    imageUrl:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    description:
      "A low-profile silhouette rooted in vintage tennis heritage. Full-grain leather upper ages beautifully.",
  },
  {
    id: "trail-crest-mid",
    name: "Trail Crest Mid",
    category: "Outdoor",
    price: "22,800",
    badge: "Sale",
    imageUrl:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Grippy Vibram outsole and waterproof knit for weekend hikes. Roomy toe box for long descents.",
  },
  {
    id: "studio-flex-lo",
    name: "Studio Flex Lo",
    category: "Training",
    price: "13,500",
    badge: "None",
    imageUrl:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
    description:
      "Flat, flexible sole for lifts and dynamic footwork. Wide platform for balance under load.",
  },
  {
    id: "boardwalk-slip",
    name: "Boardwalk Slip",
    category: "Lifestyle",
    price: "9,800",
    badge: "Sold out",
    imageUrl:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1200&q=80",
    description:
      "Canvas slip-on for warm days. Molded footbed shapes to your foot over time.",
  },
  {
    id: "nova-glide-x",
    name: "Nova Glide X",
    category: "Running",
    price: "24,600",
    badge: "New",
    imageUrl:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    description:
      "Carbon-plated racer for tempo days. Springy foam returns energy step after step.",
  },
];

export function getProductById(id: string): DemoProduct | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
