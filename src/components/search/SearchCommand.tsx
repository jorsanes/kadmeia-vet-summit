import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearchIndex } from '@/search/useFuse';
import type { SearchItem, Locale } from '@/search/types';
import { Search, ExternalLink } from 'lucide-react';

function useLang(): Locale {
  const { i18n } = useTranslation();
  const loc = i18n.language === 'en' || location.pathname.startsWith('/en') ? 'en' : 'es';
  return (loc as Locale);
}

export default function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();
  const lang = useLang();
  const { items, fuse } = useSearchIndex(lang);

  // Atajo ⌘/Ctrl + K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results: SearchItem[] = React.useMemo(() => {
    if (!query.trim()) return items.slice(0, 8);
    return fuse.search(query).slice(0, 12).map(r => r.item);
  }, [query, items, fuse]);

  function onSelect(url: string) {
    setOpen(false);
    // navegar dentro de la SPA
    navigate(url);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Tip: también puedes añadir un Trigger en el header */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
        <Dialog.Content className="fixed z-[70] top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-2xl rounded-2xl bg-background border shadow-xl">
          <Command label="Buscar" shouldFilter={false}>
            <div className="flex items-center gap-2 px-3 pt-3">
              <Search className="w-4 h-4 opacity-60" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder={lang === 'en' ? 'Search pages, posts, cases…' : 'Busca páginas, posts, casos…'}
                autoFocus
                className="w-full bg-transparent outline-none py-3"
              />
              <kbd className="ml-auto text-xs opacity-60 rounded border px-1.5 py-0.5">Esc</kbd>
            </div>
            <Command.List className="max-h-[60vh] overflow-y-auto px-2 pb-3">
              <Command.Empty className="py-6 text-center text-sm opacity-70">
                {lang === 'en' ? 'No results' : 'Sin resultados'}
              </Command.Empty>

              {/* Agrupar por tipo */}
              <Command.Group heading={lang === 'en' ? 'Pages' : 'Páginas'}>
                {results.filter(r => r.type === 'page').map(r => (
                  <Command.Item
                    key={r.id}
                    onSelect={() => onSelect(r.url)}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 aria-selected:bg-muted/60"
                  >
                    <div>
                      <div className="font-medium">{r.title}</div>
                      {r.subtitle && <div className="text-xs opacity-70">{r.subtitle}</div>}
                    </div>
                    <span className="text-[10px] uppercase opacity-60">PAGE</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading={lang === 'en' ? 'Blog' : 'Blog'}>
                {results.filter(r => r.type === 'post').map(r => (
                  <Command.Item
                    key={r.id}
                    onSelect={() => onSelect(r.url)}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 aria-selected:bg-muted/60"
                  >
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs opacity-70">
                        {r.date ? new Date(r.date).toLocaleDateString() : null} {r.subtitle ? `· ${r.subtitle}` : ''}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase opacity-60">POST</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading={lang === 'en' ? 'Case studies' : 'Casos de éxito'}>
                {results.filter(r => r.type === 'case').map(r => (
                  <Command.Item
                    key={r.id}
                    onSelect={() => onSelect(r.url)}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 aria-selected:bg-muted/60"
                  >
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs opacity-70">
                        {r.date ? new Date(r.date).toLocaleDateString() : null} {r.subtitle ? `· ${r.subtitle}` : ''}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase opacity-60">CASE</span>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}