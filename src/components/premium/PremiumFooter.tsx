import { brand } from "@/config/brand.config";

interface PremiumFooterProps {
  children?: React.ReactNode;
}

export function PremiumFooter({ children }: PremiumFooterProps) {
  return (
    <p className="text-xs text-text-muted">
      {children ?? `Powered by ${brand.productName}.`}
    </p>
  );
}
