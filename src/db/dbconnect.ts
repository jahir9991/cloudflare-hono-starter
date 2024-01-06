import { drizzle } from 'drizzle-orm/d1';
import { D1Database$ } from 'cfw-bindings-wrangler-bridge';
import { schemaD1 } from './schemas';
import { DefaultLogger } from 'drizzle-orm';
import { AppContext } from 'src/app/appBindings';

export const injectD1 = async (c:AppContext) => {
	try {
		if (c.env.DB) {
			console.log('calling server d1');

			c.env.D1DB = drizzle(c.env.DB, { schema: schemaD1, logger: true });
		} else {
			console.log('calling local');

			//local
			// event.locals.DB = (await import(SERVER_ENV.LOCAL_D1_PATH)).default

			//bridge
			const db: D1Database = new D1Database$('DB') as D1Database;
			c.env.D1DB = drizzle(db, { logger: true });
		}
	} catch (error) {
		console.log('🚀 ~ file: hooks.server.ts:27 ~ consthandle:Handle= ~ error:', error);
	}
};
