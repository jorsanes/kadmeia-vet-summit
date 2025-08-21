import { Link } from "react-router-dom";
import clsx from "clsx";

type Highlight = { label: string; value: string };

export type ContentCardProps = {
  href: string;
  title: string;
  date: Date;
  lang: "es" | "en";
  excerpt?: string;
  kicker?: string;
  badges?: string[];
  highlights?: Highlight[];
  cta?: string;
  className?: string;
};

export default function ContentCard({
  href,
  title,
  date,
  lang,
  excerpt,
  kicker,
  badges = [],
  highlights = [],
  cta,
  className,
}: ContentCardProps) {
  const locale = lang === "en" ? "en-GB" : "es-ES";
  const dateStr = new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article
      role="listitem"
      className={clsx(
        "relative rounded-2xl bg-[linear-gradient(180deg,#f9f6f1,rgba(249,246,241,0.9))] shadow-sm",
        "ring-1 ring-black/5 hover:shadow-md transition-all duration-200",
        "flex flex-col justify-between overflow-hidden min-h-[360px]",
        className
      )}
    >
      {/* overlay link accesible */}
      <Link to={href} aria-label={title} className="absolute inset-0 z-10" />

      <div className="p-5 pb-0">
        {kicker && (
          <div className="text-xs tracking-wide uppercase text-neutral-500 mb-2">
            {kicker}
          </div>
        )}

        {badges?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {badges.slice(0, 4).map((b) => (
              <span
                key={b}
                className="text-[11px] rounded-full bg-white/70 text-neutral-700 px-2 py-0.5 ring-1 ring-black/5"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        {highlights?.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {highlights.slice(0, 3).map((h, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/70 ring-1 ring-black/5 px-2 py-1"
              >
                <div className="text-[10px] text-neutral-500">{h.label}</div>
                <div className="text-sm font-medium text-neutral-800 leading-tight">
                  {h.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 pt-0 mt-auto">
        <h3 className="font-serif text-[1.1rem] leading-snug text-slate-900 mb-2">
          {title}
        </h3>

        {excerpt && (
          <p className="text-sm text-neutral-700 line-clamp-2 mb-3">{excerpt}</p>
        )}

        <div className="flex items-center justify-between text-sm text-neutral-500">
          <time dateTime={new Date(date).toISOString()}>{dateStr}</time>
          {cta && <span className="text-sky-800 font-medium">{cta}</span>}
        </div>
      </div>
    </article>
  );
}