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
        "absolute pointer-events-none opacity-8 select-none",
        "w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96",
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
        className="w-full h-full object-contain opacity-60 sm:opacity-80"
      />
    </div>
  );
};

export default BrandWatermark;