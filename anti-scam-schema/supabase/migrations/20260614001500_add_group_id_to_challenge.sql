-- Add group_id column to challenge table to link challenges to groups
ALTER TABLE challenge ADD COLUMN group_id bigint REFERENCES groups(group_id) ON DELETE CASCADE;

-- Add unique constraint: one challenge per group
ALTER TABLE challenge ADD CONSTRAINT challenge_group_unique UNIQUE(group_id);

-- Drop the old user-scoped foreign key since challenges are now group-scoped
ALTER TABLE challenge DROP CONSTRAINT challenge_id_fkey;

-- Enable RLS on challenge table
ALTER TABLE challenge ENABLE ROW LEVEL SECURITY;

-- RLS policy: allow all for now (application-level security via backend)
-- TODO: Implement proper RLS policies that check group ownership
CREATE POLICY "Enable all operations for now"
  ON challenge FOR ALL
  USING (true)
  WITH CHECK (true);
