CREATE TABLE public.client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  cnpj text NOT NULL UNIQUE,
  email text NOT NULL,
  whatsapp text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.client_profiles TO authenticated;
GRANT ALL ON public.client_profiles TO service_role;

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve seu proprio cadastro"
ON public.client_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuario atualiza seu proprio cadastro"
ON public.client_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_client()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.raw_user_meta_data ? 'cnpj' THEN
    INSERT INTO public.client_profiles (user_id, cnpj, email, whatsapp)
    VALUES (
      NEW.id,
      regexp_replace(NEW.raw_user_meta_data->>'cnpj', '\D', '', 'g'),
      NEW.email,
      NEW.raw_user_meta_data->>'whatsapp'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_client
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_client();