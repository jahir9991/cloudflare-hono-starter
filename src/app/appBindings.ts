import { DrizzleD1Database } from 'drizzle-orm/d1';
import { Context } from 'hono';

export type AppBindings = {
	DB: D1Database;
	D1DB: DrizzleD1Database;
};

export type AppContext = Context<{ Bindings: AppBindings }>;
