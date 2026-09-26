import PricesForm from "@/components/admin/PricesForm";
import { Page } from "@/components/admin/ui";
import { editablePrices, getPriceMap } from "@/lib/server/prices";

export const dynamic = "force-dynamic";

export default async function PricesPage() {
  const { groups, orphans } = editablePrices(await getPriceMap());

  const changed = groups.reduce(
    (total, group) =>
      total +
      group.services.reduce(
        (n, service) => n + service.items.filter((item) => item.savedPrice !== null).length,
        0
      ),
    0
  );

  return (
    <Page
      eyebrow="Content"
      title="Prices"
      lead="Every package price on the site. Changing one here updates the service page, the contact form and the quote it produces."
      actions={
        changed > 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            {changed} changed from original
          </p>
        ) : undefined
      }
    >
      <PricesForm groups={groups} orphans={orphans} />
    </Page>
  );
}
