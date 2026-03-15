drop extension if exists "pg_net";

alter table "public"."accounts" enable row level security;

alter table "public"."challenge" enable row level security;

alter table "public"."sessions" enable row level security;

alter table "public"."users" enable row level security;

alter table "public"."verification_token" enable row level security;


