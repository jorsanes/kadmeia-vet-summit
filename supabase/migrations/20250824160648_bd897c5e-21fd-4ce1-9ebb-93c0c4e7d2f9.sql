
-- 1) Enum de roles (solo si no existe)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'user');
  end if;
end$$;

-- 2) Tabla de roles de usuario (sin FK directa a auth.users para evitar problemas)
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- 3) Función para comprobar rol (security definer, evita RLS recursivo)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- 4) Políticas para user_roles
-- Ver sus propios roles
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_roles' and policyname = 'Users can view their own roles'
  ) then
    create policy "Users can view their own roles"
      on public.user_roles
      for select
      to authenticated
      using (user_id = auth.uid());
  end if;
end$$;

-- Admin ve todos los roles
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_roles' and policyname = 'Admins can view all roles'
  ) then
    create policy "Admins can view all roles"
      on public.user_roles
      for select
      to authenticated
      using (public.has_role(auth.uid(), 'admin'));
  end if;
end$$;

-- Admin gestiona roles
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_roles' and policyname = 'Admins manage roles'
  ) then
    create policy "Admins manage roles"
      on public.user_roles
      for all
      to authenticated
      using (public.has_role(auth.uid(), 'admin'))
      with check (public.has_role(auth.uid(), 'admin'));
  end if;
end$$;

-- Bootstrap: permitir que el primer usuario se asigne admin si aún no hay admins
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_roles' and policyname = 'Bootstrap first admin'
  ) then
    create policy "Bootstrap first admin"
      on public.user_roles
      for insert
      to authenticated
      with check (
        user_id = auth.uid()
        and role = 'admin'
        and not exists (select 1 from public.user_roles where role = 'admin')
      );
  end if;
end$$;

-- 5) Limpiar política de desarrollo en blog_posts y aplicar RLS real
-- (RLS ya está activado en blog_posts según el estado actual)
drop policy if exists "Allow all operations for development" on public.blog_posts;
drop policy if exists "Anyone can view published blog posts" on public.blog_posts;

-- Lectura pública de posts publicados
create policy "Anyone can view published blog posts"
  on public.blog_posts
  for select
  to public
  using (status = 'published');

-- Admin puede hacer todo (incluye ver borradores)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_posts' and policyname = 'Admins can do everything on blog_posts'
  ) then
    create policy "Admins can do everything on blog_posts"
      on public.blog_posts
      for all
      to authenticated
      using (public.has_role(auth.uid(), 'admin'))
      with check (public.has_role(auth.uid(), 'admin'));
  end if;
end$$;

-- 6) Trigger updated_at para blog_posts
drop trigger if exists set_timestamp_blog_posts on public.blog_posts;
create trigger set_timestamp_blog_posts
before update on public.blog_posts
for each row
execute procedure public.update_updated_at_column();

-- 7) Tabla de tags para catálogo
create table if not exists public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  lang text not null default 'es',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, lang),
  unique (name, lang)
);

alter table public.blog_tags enable row level security;

-- Lectura pública de tags
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_tags' and policyname = 'Read tags'
  ) then
    create policy "Read tags"
      on public.blog_tags
      for select
      to public
      using (true);
  end if;
end$$;

-- Escritura solo admin
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_tags' and policyname = 'Admins write tags'
  ) then
    create policy "Admins write tags"
      on public.blog_tags
      for insert, update, delete
      to authenticated
      using (public.has_role(auth.uid(), 'admin'))
      with check (public.has_role(auth.uid(), 'admin'));
  end if;
end$$;

-- Índices útiles
create index if not exists blog_tags_slug_idx on public.blog_tags (slug, lang);

-- Trigger updated_at para blog_tags
drop trigger if exists set_timestamp_blog_tags on public.blog_tags;
create trigger set_timestamp_blog_tags
before update on public.blog_tags
for each row
execute procedure public.update_updated_at_column();
