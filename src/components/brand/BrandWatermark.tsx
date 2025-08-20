import SmartImage from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';

interface BrandWatermarkProps {
  className?: string;
  size?: number;
}

const BrandWatermark = ({ className, size = 256 }: BrandWatermarkProps) => {
  return (
    <div 
      className={cn(
        "absolute pointer-events-none opacity-80 select-none",
        "w-32 h-32 sm:w-64 sm:h-64 md:w-80 md:h-80",
        className
      )}
      aria-hidden="true"
    >
      <SmartImage
        src="/assets/brand/logo-kad-mark-gold.png"
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default BrandWatermark;