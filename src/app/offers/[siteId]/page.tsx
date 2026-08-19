import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  redirect(`/money-page/${siteId}`);
}
