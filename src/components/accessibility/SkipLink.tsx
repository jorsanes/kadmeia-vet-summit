export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1000] bg-primary text-primary-foreground px-3 py-2 rounded"
    >
      Saltar al contenido
    </a>
  );
}