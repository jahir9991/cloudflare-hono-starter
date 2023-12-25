import { HTTPException } from 'hono/http-exception';
import { UserD1 } from 'src/db/schemas/User.entity';
import { AppContext } from 'src/app/appBindings';
import * as XLSX from 'xlsx';
import { eq, like, sql } from 'drizzle-orm';
import { BcryptHelper } from 'src/app/helpers/bcrypt.helper';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { Singleton } from 'src/app/utils/singleton.util';

@Singleton
export class UserService {
	getAll = async (context: AppContext) => {
		try {
			const DB = context.env.MyDb;

			const searchTerm = context.req.query('q') ?? '';
			const limit: number = Number(context.req.query('limit') ?? 10);
			const page: number = Number(context.req.query('page') ?? 1);

			const result = await DB.select()
				.from(UserD1)
				.where(like(UserD1.username, `%${searchTerm}%`))
				.limit(limit)
				.offset((page - 1) * limit);

			const [{ count }] = await DB.select({ count: sql<number>`count(*)` })
				.from(UserD1)
				.where(like(UserD1.username, `%${searchTerm}%`));

			return context.json({
				meta: {
					count,
					page,
					limit
				},
				payload: result
			});
		} catch (error) {
			console.log(error);

			return context.json({ error: error });
		}
	};

	createOne = async (context: AppContext) => {
		try {
			const DB = context.env.MyDb;

			const payload = await context.req.json();
			payload.password = await BcryptHelper.hash(payload.password);

			const result = await DB.insert(UserD1).values(payload).returning();

			return context.json({
				payload: result[0] ?? {}
			});
		} catch (error) {
			console.log(error);

			return context.json({ error: error });
		}
	};

	getOne = async (context: AppContext) => {
		try {
			const DB = context.env.MyDb;
			const id = context.req.param('id');
			console.log('getOne', id);

			const result = await DB.select().from(UserD1).where(eq(UserD1.id, id)).get();
			console.log('result', result);

			if (!result) {
				// return context.json({ error: "no user found" },{status:404});

				throw new HTTPException(401, { message: 'no user found' });
			}
			return context.json(result);
		} catch (error) {
			const errorResponse = new Response('Unauthorized', {
				status: 401
			});
			throw new HTTPException(401, { res: errorResponse });
		}
	};

	editOne = async (context: AppContext) => {
		try {
			const DB = context.env.MyDb;
			const id = context.req.param('id');

			const newData: typeof UserD1 = await context.req.json();
			const updatedData = await DB.update(UserD1)
				.set(newData as any)
				.where(eq(UserD1.id, id))
				.returning()
				.get();

			return context.json({ payload: updatedData });
		} catch (error: any) {
			console.log('err', error);
			return context.json({ error: error.message }, { status: 400 });
		}
	};

	deleteOne = async (context: AppContext) => {
		try {
			const DB = context.env.MyDb;
			const id = context.req.param('id');

			const deletedData = await DB.delete(UserD1).where(eq(UserD1.id, id)).returning();

			return context.json({
				payload: deletedData[0] ?? {}
			});
		} catch (error: any) {
			console.log('err', error);
			return context.json({ error: error.message }, { status: 400 });
		}
	};

	upload = async (c) => {
		try {
			const body: any = await c.req.parseBody();
			const ff: File = body['filed'];
			const mm = await ff.arrayBuffer();
			console.log(typeof mm);
			console.log(mm);

			if (body.filed) {
				const workbook = await XLSX.read(mm, { type: 'buffer' });
				const content = await XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

				console.log('content', content);

				return c.json({ payload: content });
			}
		} catch (error) {
			console.error(error);
		}

		return c.json({ payload: null });

		//   console.log("body", body);
	};
	fineByUserName = async (username: string, DB: DrizzleD1Database) => {
		try {
			const existUser = await DB.select()
				.from(UserD1)
				.where(eq(sql`lower(${UserD1.username})`, username.toLowerCase()))
				.get();

			return existUser;
		} catch (error) {
			throw new HTTPException(404);
		}
	};
}
