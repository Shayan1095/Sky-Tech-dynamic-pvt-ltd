import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";
import ProductsHero from "@/components/products/ProductsHero";
import ProductRow from "@/components/products/ProductRow";
import ProductsClosing from "@/components/products/ProductsClosing";

export const metadata: Metadata = pageMetadata({
  title: "Products | ERP, School, Inventory & POS Systems | SKY Tech",
  description:
    "Working systems we license and configure: DotPro ERP, DotPro School, DotPro Inventory, DotPro POS and the Quran Academy Portal. Request a demo on your own data.",
  keywords:
    "ERP software Pakistan, school management system, inventory management system, restaurant POS, online academy portal, DotPro",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      {PRODUCTS.map((product, i) => (
        <ProductRow key={product.slug} product={product} tone={i % 2 === 0 ? "bg" : "sunk"} />
      ))}
      <ProductsClosing />
    </>
  );
}
