alter table "public"."challenge" drop constraint "challenge_id_fkey";

alter table "public"."challenge" add constraint "challenge_id_fkey" FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."challenge" validate constraint "challenge_id_fkey";


