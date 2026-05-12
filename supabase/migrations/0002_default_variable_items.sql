-- ============================================================
-- 0002: Add default_variable_items template to user_settings
-- ============================================================
-- Stores the user's typical variable-expense breakdown. The
-- /month/[ym] form seeds itself from this when no record exists
-- yet for that month.
--
-- Shape (same as monthly_records.variable_items, sans note):
--   [{ "id": "uuid", "category": "食費", "amount": 8000 }]
-- ============================================================

ALTER TABLE user_settings
  ADD COLUMN default_variable_items JSONB NOT NULL DEFAULT '[]'::JSONB;
