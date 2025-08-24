
-- 1) Enum de roles
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'user');
  end if;
end $$;

-- 2) Tabla de roles por usuario
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- 3) RLS
alter table public.user_roles enable row level security;

-- Política mínima: los usuarios autenticados ven SOLO sus roles
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
      and tablename = 'user_roles' 
      and policyname = 'Users can read their own roles'
  ) then
    create policy "Users can read their own roles"
      on public.user_roles
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

-- 4) Función para comprobar roles (bypassa RLS con SECURITY DEFINER)
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
  );
$$;

-- Permisos de ejecución para clientes
grant execute on function public.has_role(uuid, public.app_role) to anon, authenticated;

-- 5) Asignar rol admin al usuario solicitado
insert into public.user_roles (user_id, role)
select u.id, 'admin'::public.app_role
from auth.users u
where u.email = 'jorge.sanchez@kadmeia.com'
on conflict do nothing;
