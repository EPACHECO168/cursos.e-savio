alter table public.client_profiles alter column cnpj drop not null;
alter table public.client_profiles add column if not exists cpf text;
create unique index if not exists client_profiles_cpf_key on public.client_profiles (cpf) where cpf is not null;

create table if not exists public.digital_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  topicos jsonb not null default '[]'::jsonb,
  price_pix numeric(10,2) not null,
  price_card_total numeric(10,2) not null,
  card_installments int not null default 1,
  pdf_path text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.digital_products to anon, authenticated;
grant all on public.digital_products to service_role;
alter table public.digital_products enable row level security;
create policy "Produtos ativos visiveis" on public.digital_products for select to anon, authenticated using (active);

create table if not exists public.client_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.digital_products(id) on delete cascade,
  status text not null default 'pending',
  preference_id text,
  payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);
grant select, insert, update on public.client_purchases to authenticated;
grant all on public.client_purchases to service_role;
alter table public.client_purchases enable row level security;
create policy "Usuario ve suas compras" on public.client_purchases for select to authenticated using (auth.uid() = user_id);
create policy "Usuario registra compra pendente" on public.client_purchases for insert to authenticated with check (auth.uid() = user_id and status = 'pending');

create or replace function public.handle_new_client()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.client_profiles (user_id, cnpj, cpf, email, whatsapp)
  values (
    new.id,
    nullif(regexp_replace(coalesce(new.raw_user_meta_data->>'cnpj',''), '\D', '', 'g'), ''),
    nullif(regexp_replace(coalesce(new.raw_user_meta_data->>'cpf',''), '\D', '', 'g'), ''),
    new.email,
    new.raw_user_meta_data->>'whatsapp'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$function$;