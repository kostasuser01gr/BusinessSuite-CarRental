import { pgTable, text, timestamp, boolean, integer, uuid, pgEnum, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'technician', 'viewer']);
export const assetStatusEnum = pgEnum('asset_status', ['available', 'in-use', 'maintenance', 'retired']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled']);
export const customerStatusEnum = pgEnum('customer_status', ['active', 'inactive', 'lead', 'prospect']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'critical']);
export const maintenanceStatusEnum = pgEnum('maintenance_status', ['pending', 'in-progress', 'completed', 'overdue', 'scheduled']);
export const activityTypeEnum = pgEnum('activity_type', ['auth', 'task', 'note', 'system', 'booking', 'customer', 'asset', 'maintenance']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').default('viewer'),
  department: text('department'),
  emailVerified: boolean('email_verified').default(false),
  mfaEnabled: boolean('mfa_enabled').default(false),
  mfaSecret: text('mfa_secret'),
  failedLoginAttempts: integer('failed_login_attempts').default(0),
  lockedUntil: timestamp('locked_until'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  createdAtIdx: index('users_created_at_idx').on(table.createdAt),
}));

export const webauthnCredentials = pgTable('webauthn_credentials', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').notNull().default(0),
  transports: jsonb('transports').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('webauthn_user_id_idx').on(table.userId),
}));

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  completed: boolean('completed').default(false).notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  dueDate: timestamp('due_date'),
  assignedTo: text('assigned_to'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('tasks_user_id_idx').on(table.userId),
  completedIdx: index('tasks_completed_idx').on(table.completed),
  dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
}));

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  pinned: boolean('pinned').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('notes_user_id_idx').on(table.userId),
  pinnedIdx: index('notes_pinned_idx').on(table.pinned),
  categoryIdx: index('notes_category_idx').on(table.category),
}));

export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  status: assetStatusEnum('status').default('available').notNull(),
  health: integer('health').default(100).notNull(),
  location: text('location').notNull(),
  department: text('department'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  statusIdx: index('assets_status_idx').on(table.status),
  typeIdx: index('assets_type_idx').on(table.type),
  departmentIdx: index('assets_department_idx').on(table.department),
}));

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address'),
  status: customerStatusEnum('status').default('lead').notNull(),
  segment: text('segment').notNull(),
  lastContact: timestamp('last_contact').notNull(),
  joinedDate: timestamp('joined_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('customers_email_idx').on(table.email),
  statusIdx: index('customers_status_idx').on(table.status),
  segmentIdx: index('customers_segment_idx').on(table.segment),
}));

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  customerName: text('customer_name').notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  date: timestamp('date').notNull(),
  value: text('value').notNull(),
  serviceType: text('service_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  customerIdIdx: index('bookings_customer_id_idx').on(table.customerId),
  statusIdx: index('bookings_status_idx').on(table.status),
  dateIdx: index('bookings_date_idx').on(table.date),
}));

export const maintenanceRecords = pgTable('maintenance_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  assetName: text('asset_name').notNull(),
  issue: text('issue').notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  status: maintenanceStatusEnum('status').default('pending').notNull(),
  dueDate: timestamp('due_date').notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  assetIdIdx: index('maintenance_asset_id_idx').on(table.assetId),
  statusIdx: index('maintenance_status_idx').on(table.status),
  dueDateIdx: index('maintenance_due_date_idx').on(table.dueDate),
}));

export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  type: activityTypeEnum('type').notNull(),
  text: text('text').notNull(),
  user: text('user').notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('activities_user_id_idx').on(table.userId),
  typeIdx: index('activities_type_idx').on(table.type),
  createdAtIdx: index('activities_created_at_idx').on(table.createdAt),
}));

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: text('resource_id'),
  changes: jsonb('changes').$type<Record<string, any>>(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  resourceIdx: index('audit_logs_resource_idx').on(table.resource),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}));

export const sessions = pgTable('sessions', {
  sid: text('sid').primaryKey(),
  sess: jsonb('sess').notNull(),
  expire: timestamp('expire').notNull(),
}, (table) => ({
  expireIdx: index('sessions_expire_idx').on(table.expire),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type NewMaintenanceRecord = typeof maintenanceRecords.$inferInsert;
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  notes: many(notes),
  activities: many(activities),
  auditLogs: many(auditLogs),
  webauthnCredentials: many(webauthnCredentials),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export const assetsRelations = relations(assets, ({ many }) => ({
  maintenanceRecords: many(maintenanceRecords),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  customer: one(customers, {
    fields: [bookings.customerId],
    references: [customers.id],
  }),
}));

export const maintenanceRecordsRelations = relations(maintenanceRecords, ({ one }) => ({
  asset: one(assets, {
    fields: [maintenanceRecords.assetId],
    references: [assets.id],
  }),
}));
