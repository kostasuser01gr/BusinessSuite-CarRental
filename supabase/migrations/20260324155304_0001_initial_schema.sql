/*
  # Initial Schema for AdaptiveAI Business Suite
  
  ## Overview
  Comprehensive database schema for a multi-tenant SaaS business management platform with complete audit trail, security features, and compliance-ready design.

  ## New Tables
  
  ### Users & Authentication
  - `users` - Core user accounts with enhanced security fields
    - id (uuid, primary key)
    - email (unique, indexed)
    - name
    - password_hash
    - role (enum: admin, manager, technician, viewer)
    - department
    - email_verified (boolean)
    - mfa_enabled, mfa_secret (2FA support)
    - failed_login_attempts, locked_until (account lockout)
    - last_login_at
    - created_at, updated_at (timestamps, indexed)
    - deleted_at (soft delete support)
  
  - `webauthn_credentials` - Passwordless authentication support
    - id (credential ID)
    - user_id (foreign key to users, cascade delete)
    - public_key
    - counter (replay protection)
    - transports (WebAuthn transport hints)
    - created_at
  
  - `sessions` - Express session storage
    - sid (session ID, primary key)
    - sess (JSONB session data)
    - expire (expiration timestamp, indexed)

  ### Core Business Entities
  - `tasks` - User task management
    - id, user_id (cascade delete)
    - title, completed (boolean, indexed)
    - priority (enum: low, medium, high, critical)
    - due_date (indexed), assigned_to
    - created_at, updated_at

  - `notes` - User notes and documentation
    - id, user_id (cascade delete)
    - title, content, category (indexed)
    - pinned (boolean, indexed)
    - created_at, updated_at

  - `assets` - Physical/digital asset tracking
    - id, name, type (indexed)
    - status (enum: available, in-use, maintenance, retired, indexed)
    - health (integer, 0-100)
    - location, department (indexed)
    - created_at, updated_at

  - `customers` - Customer relationship management
    - id, name, email (indexed), phone, address
    - status (enum: active, inactive, lead, prospect, indexed)
    - segment (indexed), last_contact
    - joined_date
    - created_at, updated_at

  - `bookings` - Service bookings/appointments
    - id, customer_id (foreign key, cascade delete)
    - customer_name, status (enum: pending, confirmed, completed, cancelled, indexed)
    - date (indexed), value, service_type
    - created_at, updated_at

  - `maintenance_records` - Asset maintenance tracking
    - id, asset_id (foreign key, cascade delete)
    - asset_name, issue
    - priority, status (enum: pending, in-progress, completed, overdue, scheduled, indexed)
    - due_date (indexed), completed_at
    - created_at, updated_at

  ### Audit & Activity
  - `activities` - User activity feed
    - id, user_id (set null on delete)
    - type (enum: auth, task, note, system, booking, customer, asset, maintenance, indexed)
    - text, user
    - metadata (JSONB for flexible data)
    - created_at (indexed)

  - `audit_logs` - Comprehensive audit trail
    - id, user_id (set null on delete)
    - action (indexed), resource (indexed), resource_id
    - changes (JSONB diff)
    - ip_address, user_agent
    - created_at (indexed)

  ## Enums
  - user_role: admin, manager, technician, viewer
  - asset_status: available, in-use, maintenance, retired
  - booking_status: pending, confirmed, completed, cancelled
  - customer_status: active, inactive, lead, prospect
  - priority: low, medium, high, critical
  - maintenance_status: pending, in-progress, completed, overdue, scheduled
  - activity_type: auth, task, note, system, booking, customer, asset, maintenance

  ## Indexes
  All foreign keys are indexed for optimal join performance.
  Frequently queried fields (email, status, dates) have dedicated indexes.
  Activity and audit logs indexed by user, type, and timestamp for efficient querying.

  ## Security & Compliance
  - Soft delete support via deleted_at column in users table
  - Audit trail captures all changes with IP and user agent
  - Account lockout mechanism for brute force protection
  - MFA support for enhanced security
  - Email verification workflow support
  - Cascade deletes ensure data integrity
  - Set null on audit/activity ensures log preservation

  ## Performance
  - Strategic indexing on all frequently queried columns
  - JSONB columns for flexible semi-structured data
  - UUID primary keys for distributed system compatibility
  - Connection pooling support in application layer
*/

-- Create enums
DO $$ BEGIN
 CREATE TYPE "public"."activity_type" AS ENUM('auth', 'task', 'note', 'system', 'booking', 'customer', 'asset', 'maintenance');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."asset_status" AS ENUM('available', 'in-use', 'maintenance', 'retired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."customer_status" AS ENUM('active', 'inactive', 'lead', 'prospect');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."maintenance_status" AS ENUM('pending', 'in-progress', 'completed', 'overdue', 'scheduled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high', 'critical');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('admin', 'manager', 'technician', 'viewer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" "activity_type" NOT NULL,
	"text" text NOT NULL,
	"user" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" "asset_status" DEFAULT 'available' NOT NULL,
	"health" integer DEFAULT 100 NOT NULL,
	"location" text NOT NULL,
	"department" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"resource_id" text,
	"changes" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"customer_name" text NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"date" timestamp NOT NULL,
	"value" text NOT NULL,
	"service_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text,
	"status" "customer_status" DEFAULT 'lead' NOT NULL,
	"segment" text NOT NULL,
	"last_contact" timestamp NOT NULL,
	"joined_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "maintenance_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"asset_name" text NOT NULL,
	"issue" text NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"status" "maintenance_status" DEFAULT 'pending' NOT NULL,
	"due_date" timestamp NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"sid" text PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"priority" "priority" DEFAULT 'medium' NOT NULL,
	"due_date" timestamp,
	"assigned_to" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'viewer',
	"department" text,
	"email_verified" boolean DEFAULT false,
	"mfa_enabled" boolean DEFAULT false,
	"mfa_secret" text,
	"failed_login_attempts" integer DEFAULT 0,
	"locked_until" timestamp,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "webauthn_credentials" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"public_key" text NOT NULL,
	"counter" integer DEFAULT 0 NOT NULL,
	"transports" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "webauthn_credentials" ADD CONSTRAINT "webauthn_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "activities_user_id_idx" ON "activities" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "activities_type_idx" ON "activities" USING btree ("type");
CREATE INDEX IF NOT EXISTS "activities_created_at_idx" ON "activities" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "assets_status_idx" ON "assets" USING btree ("status");
CREATE INDEX IF NOT EXISTS "assets_type_idx" ON "assets" USING btree ("type");
CREATE INDEX IF NOT EXISTS "assets_department_idx" ON "assets" USING btree ("department");
CREATE INDEX IF NOT EXISTS "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" USING btree ("action");
CREATE INDEX IF NOT EXISTS "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource");
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "bookings_customer_id_idx" ON "bookings" USING btree ("customer_id");
CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings" USING btree ("status");
CREATE INDEX IF NOT EXISTS "bookings_date_idx" ON "bookings" USING btree ("date");
CREATE INDEX IF NOT EXISTS "customers_email_idx" ON "customers" USING btree ("email");
CREATE INDEX IF NOT EXISTS "customers_status_idx" ON "customers" USING btree ("status");
CREATE INDEX IF NOT EXISTS "customers_segment_idx" ON "customers" USING btree ("segment");
CREATE INDEX IF NOT EXISTS "maintenance_asset_id_idx" ON "maintenance_records" USING btree ("asset_id");
CREATE INDEX IF NOT EXISTS "maintenance_status_idx" ON "maintenance_records" USING btree ("status");
CREATE INDEX IF NOT EXISTS "maintenance_due_date_idx" ON "maintenance_records" USING btree ("due_date");
CREATE INDEX IF NOT EXISTS "notes_user_id_idx" ON "notes" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "notes_pinned_idx" ON "notes" USING btree ("pinned");
CREATE INDEX IF NOT EXISTS "notes_category_idx" ON "notes" USING btree ("category");
CREATE INDEX IF NOT EXISTS "sessions_expire_idx" ON "sessions" USING btree ("expire");
CREATE INDEX IF NOT EXISTS "tasks_user_id_idx" ON "tasks" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "tasks_completed_idx" ON "tasks" USING btree ("completed");
CREATE INDEX IF NOT EXISTS "tasks_due_date_idx" ON "tasks" USING btree ("due_date");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "webauthn_user_id_idx" ON "webauthn_credentials" USING btree ("user_id");