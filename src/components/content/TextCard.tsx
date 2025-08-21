import { Link } from "react-router-dom";

type Props = {
  title: string;
  date: string;
  href: string;
  excerpt?: string;
  cta?: string;
};

export function TextCard({ title, date, href, excerpt, cta = "Ver más →" }: Props) {
  return (
    <article className="relative rounded-2xl bg-gradient-to-b from-white to-[#f8f5f0] shadow-[0_10px_40px_-15px_rgba(0,0,0,.15)] ring-1 ring-black/5 overflow-hidden transition hover:shadow-[0_18px_50px_-10px_rgba(0,0,0,.2)]">
      {/* overlay link accesible */}
      <Link to={href} aria-label={title} className="absolute inset-0 z-10" />
      {/* "cabecera" vacía para el look de tarjeta sin imagen */}
      <div className="aspect-[4/3] w-full bg-[#f1ede7]" />
      <div className="p-4">
        <h3 className="font-serif text-lg text-[#0b2436]">{title}</h3>
        {excerpt && (
          <p
            className="mt-1 text-sm text-muted-foreground"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{date}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary">{cta}</span>
      </div>
    </article>
  );
}