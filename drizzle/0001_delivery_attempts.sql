ALTER TABLE lead_deliveries ADD COLUMN attempt_count INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE lead_deliveries ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0;
