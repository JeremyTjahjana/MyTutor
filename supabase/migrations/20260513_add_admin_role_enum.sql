-- Add the admin role to the public.user_role enum.
-- This must run in its own migration so the enum value is committed
-- before later migrations reference it.

alter type public.user_role add value if not exists 'admin';
