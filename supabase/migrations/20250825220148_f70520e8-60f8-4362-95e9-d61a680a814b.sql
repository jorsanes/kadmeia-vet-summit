
-- 1) Políticas: eliminar las anteriores para evitar conflictos
DROP POLICY IF EXISTS "Admins can insert editable pages" ON public.editable_pages;
DROP POLICY IF EXISTS "Admins can update editable pages" ON public.editable_pages;
DROP POLICY IF EXISTS "Admins can view all editable pages" ON public.editable_pages;

-- 2) Lectura pública (el contenido de las páginas es público)
CREATE POLICY "Public can read editable pages"
  ON public.editable_pages
  FOR SELECT
  USING (true);

-- 3) Inserción solo admins
CREATE POLICY "Admins can insert editable pages"
  ON public.editable_pages
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4) Actualización solo admins
CREATE POLICY "Admins can update editable pages"
  ON public.editable_pages
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5) Garantizar upsert y evitar duplicados
-- Si existieran filas duplicadas (mismo page_key, lang), esta sentencia fallaría.
-- Asumimos que no hay duplicados. Si los hubiera, podemos depurarlos después.
ALTER TABLE public.editable_pages
  ADD CONSTRAINT editable_pages_unique_page_lang UNIQUE (page_key, lang);
