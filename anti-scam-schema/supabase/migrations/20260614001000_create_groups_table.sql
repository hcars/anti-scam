-- Create groups table
CREATE TABLE groups (
  group_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  owner_id integer NOT NULL,
  group_name text NOT NULL,
  CONSTRAINT groups_pkey PRIMARY KEY (group_id),
  CONSTRAINT groups_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Enable RLS on groups table
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- RLS policy: allow all for now (application-level security via backend)
-- TODO: Implement proper RLS policies that map auth.uid() to user IDs
CREATE POLICY "Enable all operations for now"
  ON groups FOR ALL
  USING (true)
  WITH CHECK (true);
