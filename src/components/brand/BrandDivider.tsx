import SmartImage from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';

interface BrandDividerProps {
  className?: string;
}

const BrandDivider = ({ className }: BrandDividerProps) => {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="flex items-center w-full max-w-md">
        <div className="flex-1 h-px bg-border/30" />
        <div className="mx-6">
          <SmartImage
            src="/assets/brand/logo-kad-mark-gold.png"
            alt=""
            width={16}
            height={16}
            loading="lazy"
            decoding="async"
            className="w-4 h-4 opacity-60"
          />
        </div>
        <div className="flex-1 h-px bg-border/30" />
      </div>
    </div>
  );
};

export default BrandDivider;