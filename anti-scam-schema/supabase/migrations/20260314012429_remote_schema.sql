drop extension if exists "pg_net";

revoke delete on table "public"."challenge" from "anon";

revoke insert on table "public"."challenge" from "anon";

revoke references on table "public"."challenge" from "anon";

revoke select on table "public"."challenge" from "anon";

revoke trigger on table "public"."challenge" from "anon";

revoke truncate on table "public"."challenge" from "anon";

revoke update on table "public"."challenge" from "anon";

revoke delete on table "public"."challenge" from "authenticated";

revoke insert on table "public"."challenge" from "authenticated";

revoke references on table "public"."challenge" from "authenticated";

revoke select on table "public"."challenge" from "authenticated";

revoke trigger on table "public"."challenge" from "authenticated";

revoke truncate on table "public"."challenge" from "authenticated";

revoke update on table "public"."challenge" from "authenticated";

revoke delete on table "public"."challenge" from "service_role";

revoke insert on table "public"."challenge" from "service_role";

revoke references on table "public"."challenge" from "service_role";

revoke select on table "public"."challenge" from "service_role";

revoke trigger on table "public"."challenge" from "service_role";

revoke truncate on table "public"."challenge" from "service_role";

revoke update on table "public"."challenge" from "service_role";

alter table "public"."challenge" drop constraint "challenge_id_fkey";

alter table "public"."challenge" drop constraint "challenge_pkey";

drop index if exists "public"."challenge_pkey";

drop table "public"."challenge";

alter table "public"."accounts" enable row level security;

alter table "public"."sessions" enable row level security;

alter table "public"."users" enable row level security;

drop sequence if exists "public"."challenge_id_seq";


