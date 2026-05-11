-- ============================================================
-- user_settings: one row per user
-- ============================================================
CREATE TABLE user_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  monthly_income  NUMERIC(12, 0) NOT NULL DEFAULT 0,
  etf_amount      NUMERIC(12, 0) NOT NULL DEFAULT 24000,
  fixed_expenses  JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- fixed_expenses shape:
  -- [{ "id": "uuid", "name": "房租", "amount": 18000 }]
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- monthly_records: one row per user per month
-- ============================================================
CREATE TABLE monthly_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year_month      CHAR(7) NOT NULL,
  -- year_month format: "YYYY-MM" e.g. "2025-01"
  bonus           NUMERIC(12, 0) NOT NULL DEFAULT 0,
  variable_total  NUMERIC(12, 0) NOT NULL DEFAULT 0,
  variable_items  JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- variable_items shape:
  -- [{ "id": "uuid", "category": "食費", "amount": 8000, "note": "optional" }]
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, year_month)
);

CREATE INDEX idx_monthly_records_user_year_month
  ON monthly_records(user_id, year_month DESC);

-- ============================================================
-- Row Level Security — users can only touch their own data
-- ============================================================
ALTER TABLE user_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_settings: own rows only"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monthly_records: own rows only"
  ON monthly_records FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Auto-update updated_at on every UPDATE
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_monthly_records_updated_at
  BEFORE UPDATE ON monthly_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
