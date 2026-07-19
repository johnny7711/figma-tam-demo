import { useState } from "react";
import { ListingPage } from "./pages/ListingPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { PdpWithRecPage } from "./pages/PdpWithRecPage";

type Route =
  | { name: "listing" }
  | { name: "pdp"; productId: string; variant: "v1" | "v2" }
  | { name: "pdp-rec"; productId: string };

export default function App() {
  const [route, setRoute] = useState<Route>({ name: "listing" });

  const openProduct = (productId: string, variant: "v1" | "v2" = "v1") =>
    setRoute({ name: "pdp", productId, variant });
  const openPdpWithRec = (productId: string) =>
    setRoute({ name: "pdp-rec", productId });
  const backToListing = () => setRoute({ name: "listing" });

  const isPdp = route.name === "pdp";
  const isPdpRec = route.name === "pdp-rec";
  const currentVariant = isPdp ? route.variant : undefined;

  return (
    <>
      <header className="demo-topbar">
        <div className="demo-topbar-brand">SoleStreet</div>
        <nav className="demo-topbar-nav">
          <button
            aria-current={route.name === "listing"}
            onClick={backToListing}
          >
            Shop
          </button>
          <button
            aria-current={isPdp && currentVariant === "v1"}
            onClick={() => openProduct("aero-lite-01", "v1")}
          >
            PDP v1
          </button>
          <button
            aria-current={isPdp && currentVariant === "v2"}
            onClick={() => openProduct("aero-lite-01", "v2")}
          >
            PDP v2
          </button>
          <button
            aria-current={isPdpRec}
            onClick={() => openPdpWithRec("aero-lite-01")}
          >
            PDP + Rec
          </button>
        </nav>
      </header>

      {route.name === "listing" && (
        <ListingPage onOpenProduct={(id) => openProduct(id, "v1")} />
      )}
      {isPdp && (
        <ProductDetailPage
          productId={route.productId}
          variant={route.variant}
          onBack={backToListing}
        />
      )}
      {isPdpRec && (
        <PdpWithRecPage productId={route.productId} onBack={backToListing} />
      )}
    </>
  );
}
