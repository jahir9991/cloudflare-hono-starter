import { drizzle } from 'drizzle-orm/d1';
import {  D1Database$ } from 'cfw-bindings-wrangler-bridge';
import { schemaD1 } from './schemas';

export const injectD1 = async (c) => {
	try {
		if (c.env.DB) {
			console.log('calling priod');

			c.env.MyDb = drizzle(c.env.DB, { schema: schemaD1 });
		} else {
			console.log('calling local');

			

			//local
			// event.locals.DB = (await import(SERVER_ENV.LOCAL_D1_PATH)).default

			//bridge
			const db: D1Database = new D1Database$('DB') as D1Database;
			c.env.MyDb = drizzle(db);
		}
	} catch (error) {
		console.log('🚀 ~ file: hooks.server.ts:27 ~ consthandle:Handle= ~ error:', error);
	}
};
