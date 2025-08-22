import { SmartImage } from '@/components/mdx';
import { cn } from '@/lib/utils';

interface BrandWatermarkProps {
  className?: string;
  size?: number;
}

const BrandWatermark = ({ className, size = 256 }: BrandWatermarkProps) => {
  return (
    <div 
      className={cn(
        "absolute pointer-events-none opacity-30 select-none",
        "w-20 h-20 sm:w-40 sm:h-40 md:w-48 md:h-48",
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