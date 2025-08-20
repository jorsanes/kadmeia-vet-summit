const BrandDivider = () => {
  return (
    <div className="py-8 bg-secondary/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-px bg-secondary/30"></div>
            <div className="w-2 h-2 bg-secondary/50 rounded-full"></div>
            <div className="w-8 h-px bg-secondary/30"></div>
            <div className="w-2 h-2 bg-secondary/70 rounded-full"></div>
            <div className="w-12 h-px bg-secondary/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDivider;