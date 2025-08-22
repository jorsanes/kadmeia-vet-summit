// src/components/cases/Testimonial.tsx
export function Testimonial({
  quote,
  author,
  role,
}: { quote?: string; author?: string; role?: string }) {
  if (!quote) return null;
  return (
    <aside className="mt-6 rounded-2xl border bg-white/60 p-4 italic shadow-sm">
      "{quote}"
      {(author || role) && (
        <div className="mt-2 not-italic text-sm font-medium">
          — {author}{role ? `, ${role}` : ""}
        </div>
      )}
    </aside>
  );
}