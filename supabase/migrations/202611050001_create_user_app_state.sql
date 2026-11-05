create table if not exists public.user_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 32),
  learning_language text not null default 'English',
  learning_goal text not null default '',
  starting_choice text not null default '' check (starting_choice in ('', 'scratch', 'check')),
  placement_answers jsonb not null default '[null, null, null, null, null]'::jsonb,
  starter_answer smallint,
  hero_options jsonb not null default '[0, 0, 0, 0]'::jsonb,
  active_level smallint not null default 1 check (active_level between 1 and 4),
  completed_missions jsonb not null default '[]'::jsonb,
  conversation_done boolean not null default false,
  sound_effects boolean not null default true,
  practice_reminders boolean not null default false,
  onboarding_completed boolean not null default false,
  client_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint placement_answers_is_array check (jsonb_typeof(placement_answers) = 'array'),
  constraint hero_options_is_array check (jsonb_typeof(hero_options) = 'array'),
  constraint completed_missions_is_array check (jsonb_typeof(completed_missions) = 'array')
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_app_state_updated_at on public.user_app_state;
create trigger set_user_app_state_updated_at
before update on public.user_app_state
for each row execute function public.set_updated_at();

alter table public.user_app_state enable row level security;

revoke all on table public.user_app_state from anon, authenticated;
grant select, insert, update, delete on table public.user_app_state to authenticated;

drop policy if exists "Users can read own app state" on public.user_app_state;
create policy "Users can read own app state"
on public.user_app_state for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own app state" on public.user_app_state;
create policy "Users can create own app state"
on public.user_app_state for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own app state" on public.user_app_state;
create policy "Users can update own app state"
on public.user_app_state for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own app state" on public.user_app_state;
create policy "Users can delete own app state"
on public.user_app_state for delete
to authenticated
using ((select auth.uid()) = user_id);
