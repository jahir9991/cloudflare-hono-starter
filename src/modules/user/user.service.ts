import { HTTPException } from 'hono/http-exception';
import { UserD1 } from 'src/db/schemas/User.entity';
import { AppContext } from 'src/app/appBindings';
import * as XLSX from 'xlsx';
import { eq, like, sql } from 'drizzle-orm';
import { BcryptHelper } from 'src/app/helpers/bcrypt.helper';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { Singleton } from 'src/app/utils/singleton.util';
import { MyHTTPException } from 'src/app/exceptions/MyHttpExceptions';

@Singleton
export class UserService {
	getAll = async (
		DB: DrizzleD1Database,
		options: { q?: string; limit?: number; page?: number }
	) => {
		try {
			console.log('getAll', options);

			const searchTerm = options.q ?? '';
			const limit: number = Number(options.limit ?? 10);
			const page: number = Number(options.page ?? 1);

			const result = await DB.select()
				.from(UserD1)
				.where(like(UserD1.username, `%${searchTerm}%`))
				.limit(limit)
				.offset((page - 1) * limit);

			const [{ count }] = await DB.select({ count: sql<number>`count(*)` })
				.from(UserD1)
				.where(like(UserD1.username, `%${searchTerm}%`));

			return {
				success: true,
				meta: {
					count,
					page,
					limit
				},
				payload: result
			};
		} catch (error) {
			console.log(error);

			throw new MyHTTPException(400, {
				message: 'something went Wrong',
				devMessage: 'this is dev message'
			});
		}
	};
	getOne = async (DB: DrizzleD1Database, id: string) => {
		try {
			console.log('getOne', id);

			const result = await DB.select().from(UserD1).where(eq(UserD1.id, id)).get();
			console.log('result', result);

			if (!result) {
				// return { error: "no user found" },{status:404});

				throw new HTTPException(404, { message: 'no user found' });
			}
			return {
				success: true,
				payload: result
			};
		} catch (error) {
			const errorResponse = new Response('Unauthorized', {
				status: 401
			});
			throw new HTTPException(401, { res: errorResponse });
		}
	};

	createOne = async (context: AppContext) => {
		try {
			const DB = context.env.MyDb;

			const payload = await context.req.json();
			payload.password = await BcryptHelper.hash(payload.password);

			const result = await DB.insert(UserD1).values(payload).returning();

			return {
				success: true,
				payload: result[0] ?? {}
			};
		} catch (error) {
			console.log(error);

			return { error: error };
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

			return { success: true, payload: updatedData };
		} catch (error: any) {
			console.log('err', error);
			throw new HTTPException(400, { message: error.message });
		}
	};

	deleteOne = async (context: AppContext) => {
		try {
			const DB = context.env.MyDb;
			const id = context.req.param('id');

			const deletedData = await DB.delete(UserD1).where(eq(UserD1.id, id)).returning();

			return {
				success: true,
				payload: deletedData[0] ?? {}
			};
		} catch (error: any) {
			console.log('err', error);
			throw new HTTPException(400, { message: error.message });
		}
	};

	upload = async (context) => {
		try {
			const body: any = await context.req.parseBody();
			const ff: File = body['filed'];
			const mm = await ff.arrayBuffer();
			console.log(typeof mm);
			console.log(mm);

			if (body.filed) {
				const workbook = await XLSX.read(mm, { type: 'buffer' });
				const content = await XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

				console.log('content', content);

				return { success: true, payload: content };
			}
		} catch (error: any) {
			console.error(error);
			throw new HTTPException(400, { message: error.message });
		}

		
	};
	fineByUserName = async (DB: DrizzleD1Database,username: string, ) => {
		try {
			const existUser = await DB.select()
				.from(UserD1)
				.where(eq(sql`lower(${UserD1.username})`, username.toLowerCase()))
				.get();

			return { success: true, payload: existUser };
		} catch (error: any) {
			throw new HTTPException(404, { message: error.message });
		}
	};
}
