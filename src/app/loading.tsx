import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function Loading() {
  return <PageSkeleton cards={2} className="max-w-7xl" />;
}
