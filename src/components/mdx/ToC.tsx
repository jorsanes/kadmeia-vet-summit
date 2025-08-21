import { useEffect, useState } from 'react';

type Item = { id: string; text: string; level: number };

export default function ToC() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    const hs = Array.from(document.querySelectorAll('main h2, main h3')) as HTMLHeadingElement[];
    setItems(
      hs.map(h => ({ id: h.id, text: h.textContent ?? '', level: h.tagName === 'H3' ? 3 : 2 }))
    );
  }, []);
  if (!items.length) return null;
  return (
    <nav aria-label="Tabla de contenidos" className="space-y-1 text-sm">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={`block hover:underline ${i.level === 3 ? 'pl-4' : ''}`}>
          {i.text}
        </a>
      ))}
    </nav>
  );
}