import { cn } from "@/lib/utils";

interface BrandWatermarkProps {
  className?: string;
}

const BrandWatermark = ({ className }: BrandWatermarkProps) => {
  return (
    <div className={cn("absolute pointer-events-none select-none opacity-5", className)}>
      <div className="font-display text-6xl font-bold text-secondary tracking-tight">
        KAD
      </div>
    </div>
  );
};

export default BrandWatermark;