import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearchIndex } from '@/search/useFuse';
import type { SearchItem, Locale } from '@/search/types';
import { getRecentQueries, pushRecentQuery } from '@/search/history';
import { Search, ExternalLink, Globe, Link as LinkIcon, MessageSquareMore } from 'lucide-react';
import { toast } from 'sonner';

function useLang(pathname: string): Locale {
  const isEN = pathname.startsWith('/en');
  return (isEN ? 'en' : 'es') as Locale;
}

type Filter = 'all' | 'page' | 'post' | 'case';

function parseQuery(q: string): { filter: Filter; text: string } {
  const s = q.trim();
  if (/^p:\s*/i.test(s)) return { filter: 'page', text: s.replace(/^p:\s*/i, '') };
  if (/^b:\s*/i.test(s)) return { filter: 'post', text: s.replace(/^b:\s*/i, '') };
  if (/^c:\s*/i.test(s)) return { filter: 'case', text: s.replace(/^c:\s*/i, '') };
  return { filter: 'all', text: s };
}

export default function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [recent, setRecent] = React.useState<string[]>([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lang = useLang(pathname);
  const { items, fuse } = useSearchIndex(lang);
  const { i18n } = useTranslation();

  // Atajo ⌘/Ctrl+K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Cargar historial
  React.useEffect(() => {
    if (open) setRecent(getRecentQueries());
  }, [open]);

  const { filter, text } = React.useMemo(() => parseQuery(query), [query]);

  const filtered: SearchItem[] = React.useMemo(() => {
    const base = !text ? items : fuse.search(text).map(r => r.item);
    const sliced = base.slice(0, 12);
    if (filter === 'all') return sliced;
    return sliced.filter(i => i.type === filter);
  }, [text, filter, items, fuse]);

  function onSelect(url: string) {
    if (text) pushRecentQuery(query); // guardamos con prefijo si lo usó
    setOpen(false);
    navigate(url);
  }

  function actionToggleLang() {
    const next = lang === 'en' ? 'es' : 'en';
    i18n.changeLanguage(next);
    const to = next === 'en'
      ? (pathname === '/' ? '/en' : `/en${pathname === '/' ? '' : pathname}`)
      : pathname.replace(/^\/en/, '') || '/';
    setOpen(false);
    navigate(to);
  }

  async function actionCopyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(lang === 'en' ? 'URL copied' : 'URL copiada');
    } catch {
      toast.error(lang === 'en' ? 'Cannot copy URL' : 'No se pudo copiar la URL');
    }
  }

  function actionContact() {
    setOpen(false);
    navigate(lang === 'en' ? '/en/contact' : '/contacto');
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
        <Dialog.Content className="fixed z-[70] top-[12%] left-1/2 -translate-x-1/2 w-[92vw] max-w-2xl rounded-2xl bg-background border shadow-xl">
          <Command label={lang === 'en' ? 'Search' : 'Buscar'} shouldFilter={false}>
            <div className="flex items-center gap-2 px-3 pt-3">
              <Search className="w-4 h-4 opacity-60" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder={
                  lang === 'en'
                    ? 'p: pages · b: blog · c: cases'
                    : 'p: páginas · b: blog · c: casos'
                }
                autoFocus
                className="w-full bg-transparent outline-none py-3"
              />
              <kbd className="ml-auto text-xs opacity-60 rounded border px-1.5 py-0.5">Esc</kbd>
            </div>

            <Command.List className="max-h-[60vh] overflow-y-auto px-2 pb-3">
              <Command.Empty className="py-6 text-center text-sm opacity-70">
                {lang === 'en' ? 'No results' : 'Sin resultados'}
              </Command.Empty>

              {/* Acciones rápidas */}
              <Command.Group heading={lang === 'en' ? 'Actions' : 'Acciones'}>
                <Command.Item
                  onSelect={actionToggleLang}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 aria-selected:bg-muted/60"
                >
                  <Globe className="w-4 h-4" />
                  {lang === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
                </Command.Item>

                <Command.Item
                  onSelect={actionContact}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 aria-selected:bg-muted/60"
                >
                  <MessageSquareMore className="w-4 h-4" />
                  {lang === 'en' ? 'Contact' : 'Contacto'}
                </Command.Item>

                <Command.Item
                  onSelect={actionCopyUrl}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 aria-selected:bg-muted/60"
                >
                  <LinkIcon className="w-4 h-4" />
                  {lang === 'en' ? 'Copy current URL' : 'Copiar URL actual'}
                </Command.Item>
              </Command.Group>

              {/* Historial (sólo si no hay texto) */}
              {!text && recent.length > 0 && (
                <Command.Group heading={lang === 'en' ? 'Recent' : 'Recientes'}>
                  {recent.map((q) => (
                    <Command.Item
                      key={q}
                      onSelect={() => setQuery(q)}
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 aria-selected:bg-muted/60"
                    >
                      <div className="opacity-80">{q}</div>
                      <span className="text-[10px] uppercase opacity-60">HIST</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Resultados por tipo */}
              <Command.Group heading={lang === 'en' ? 'Pages' : 'Páginas'}>
                {filtered.filter(r => r.type === 'page').map((r) => (
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

              <Command.Group heading="Blog">
                {filtered.filter(r => r.type === 'post').map((r) => (
                  <Command.Item
                    key={r.id}
                    onSelect={() => onSelect(r.url)}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 aria-selected:bg-muted/60"
                  >
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs opacity-70">
                        {r.date ? new Date(r.date).toLocaleDateString() : null}
                        {r.subtitle ? ` · ${r.subtitle}` : ''}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase opacity-60">POST</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading={lang === 'en' ? 'Case studies' : 'Casos de éxito'}>
                {filtered.filter(r => r.type === 'case').map((r) => (
                  <Command.Item
                    key={r.id}
                    onSelect={() => onSelect(r.url)}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 aria-selected:bg-muted/60"
                  >
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs opacity-70">
                        {r.date ? new Date(r.date).toLocaleDateString() : null}
                        {r.subtitle ? ` · ${r.subtitle}` : ''}
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