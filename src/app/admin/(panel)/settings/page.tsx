import SettingsForm from "@/components/admin/SettingsForm";
import { Page } from "@/components/admin/ui";
import { getSettings } from "@/lib/server/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <Page
      eyebrow="Content"
      title="Site details"
      lead="The phone number, email address and social links shown across the website. Saving updates every page."
    >
      <SettingsForm settings={settings} />
    </Page>
  );
}
