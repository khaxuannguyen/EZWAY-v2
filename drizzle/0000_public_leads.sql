CREATE TABLE IF NOT EXISTS quote_requests (
 request_id TEXT PRIMARY KEY, idempotency_key TEXT NOT NULL UNIQUE, payload_hash TEXT NOT NULL,
 payload_json TEXT NOT NULL, created_at TEXT NOT NULL, consent_recorded_at TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW','CONTACTED','QUOTED','CONVERTED','CLOSED')),
 zalo_notification_status TEXT NOT NULL DEFAULT 'PENDING', email_notification_status TEXT NOT NULL DEFAULT 'NOT_CONFIGURED'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS lead_jobs (
 request_id TEXT PRIMARY KEY REFERENCES quote_requests(request_id) ON DELETE CASCADE,
 state TEXT NOT NULL DEFAULT 'PENDING', next_attempt_at INTEGER NOT NULL, lease_until INTEGER NOT NULL DEFAULT 0,
 lease_owner TEXT, attempts INTEGER NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS lead_deliveries (
 request_id TEXT NOT NULL REFERENCES quote_requests(request_id) ON DELETE CASCADE,
 channel TEXT NOT NULL, recipient TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING',
 provider_message_id TEXT, last_error_code TEXT, PRIMARY KEY(request_id,channel,recipient)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS quote_rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS lead_jobs_due ON lead_jobs(state,next_attempt_at);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS quote_created ON quote_requests(created_at);
