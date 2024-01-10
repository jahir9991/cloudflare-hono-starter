import { UserD1, UserD1Select } from 'src/db/schemas/User.entity';
import { AppContext } from 'src/app/appBindings';
import * as XLSX from 'xlsx';
import { eq, like, sql, DrizzleError } from 'drizzle-orm';
import { BcryptHelper } from 'src/app/helpers/bcrypt.helper';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { MyHTTPException } from 'src/app/exceptions/MyHttpExceptions';
import { getDbSelectkey } from 'src/app/utils/getSelectKey.util';
import { SuccessResponse } from 'src/app/responses/success.response';
import { DI } from 'src/app/utils/DI.util';

@DI.singleton()
export class UserService {
	getAll = async (
		DB: DrizzleD1Database,
		options: { q?: string; limit?: number; page?: number },
		dbSelectKeys?: string[],
		withMeta: boolean = true
	): Promise<SuccessResponse> => {
		try {
			const searchTerm = options.q ?? '';
			const limit: number = Number(options.limit ?? 10);
			const page: number = Number(options.page ?? 1);

			const payloadQ = DB.select(getDbSelectkey(dbSelectKeys, UserD1))
				.from(UserD1)
				.where(like(UserD1.username, `%${searchTerm}%`))
				.limit(limit)
				.offset((page - 1) * limit);

			const countQ = DB.select({ count: sql<number>`count(*)` })
				.from(UserD1)
				.where(like(UserD1.username, `%${searchTerm}%`));

			const batchResponse = await DB.batch([payloadQ, ...(withMeta ? [countQ] : [])]);

			let meta;

			if (withMeta) {
				const [{ count: total }] = batchResponse[1];

				meta = {
					total,
					page,
					limit
				};
			}

			const rt = {
				success: true,
				message: 'success',
				...(meta && { meta }),
				payload: batchResponse[0]
			};

			return rt;
		} catch (error: any) {
			console.log('🚀 ~ UserService ~ error:', error);
			throw new MyHTTPException(400, {
				message: 'something went Wrong',
				devMessage: error.message,
				error: error.stack
			});
		}
	};
	getOne = async (DB: DrizzleD1Database, id: string): Promise<SuccessResponse> => {
		try {
			console.log('getOne', id);

			const result = await DB.select().from(UserD1).where(eq(UserD1.id, id)).get();
			console.log('result', result);

			return {
				message: result ? 'success' : 'no data found',
				success: true,
				payload: result ?? null
			};
		} catch (error) {
			console.log('🚀 ~ UserService ~ getOne= ~ error:', error);

			throw new MyHTTPException(400, {
				message: 'something went Wrong',
				devMessage: 'this is dev message',
				error: JSON.stringify(error)
			});
		}
	};

	createOne = async (DB, payload): Promise<SuccessResponse> => {
		try {
			payload.password = await BcryptHelper.hash(payload.password);

			const result = await DB.insert(UserD1).values(payload).returning();

			return {
				success: true,
				message: 'success',
				payload: result[0] ?? {}
			};
		} catch (e: any) {
			let error = {};

			if (e instanceof DrizzleError) {
				error = e.cause;
			}

			throw new MyHTTPException(400, {
				message: e.message ?? 'something went Wrong',
				devMessage: e.message ?? 'this is dev message',
				error: e
			});
		}
	};

	editOne = async (context: AppContext) => {
		try {
			const DB = context.env.D1DB;
			const id = context.req.param('id');

			const newData: typeof UserD1 = await context.req.json();
			const updatedData = await DB.update(UserD1)
				.set(newData as any)
				.where(eq(UserD1.id, id))
				.returning()
				.get();

			return { success: true, payload: updatedData };
		} catch (error: any) {
			throw new MyHTTPException(400, {
				message: 'something went Wrong',
				devMessage: 'this is dev message',
				error
			});
		}
	};

	deleteOne = async (context: AppContext) => {
		try {
			const DB = context.env.D1DB;
			const id = context.req.param('id');

			const deletedData = await DB.delete(UserD1).where(eq(UserD1.id, id)).returning();

			return {
				success: true,
				payload: deletedData[0] ?? {}
			};
		} catch (error: any) {
			console.log('err', error);
			throw new MyHTTPException(400, {
				message: 'something went Wrong',
				devMessage: 'this is dev message',
				error
			});
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
			throw new MyHTTPException(400, {
				message: 'something went Wrong',
				devMessage: 'this is dev message',
				error
			});
		}
	};
	fineByUserName = async (DB: DrizzleD1Database, username: string) => {
		try {
			const existUser = await DB.select()
				.from(UserD1)
				.where(eq(sql`lower(${UserD1.username})`, username.toLowerCase()))
				.get();

			return { success: true, payload: existUser };
		} catch (error: any) {
			throw new MyHTTPException(400, {
				message: 'something went Wrong',
				devMessage: 'this is dev message',
				error
			});
		}
	};
}
