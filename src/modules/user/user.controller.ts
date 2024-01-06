import { Handler } from 'hono';

import { Singleton } from 'src/app/utils/singleton.util';
import { AppContext } from 'src/app/appBindings';
import { UserService } from 'src/modules/user/user.service';
import { insertUserSchema } from 'src/db/schemas/User.entity';

@Singleton
export class UserController {
	private readonly modelService: UserService = new UserService();

	getAll: Handler = async (context: AppContext) => {
		try {
			const options = {
				limit: Number(context.req.query('limit') ?? 10),
				page: Number(context.req.query('page') ?? 1),
				q: context.req.query('q') ?? ''
			};
			const selectedFields = JSON.parse(context.req.query('fields') ?? '[]') ?? [];

			const response = await this.modelService.getAll(
				context.env.D1DB,
				options,
				selectedFields,
				false
			);
			return context.json(response);
		} catch (error) {
			throw error;
		}
	};

	createOne: Handler = async (context: AppContext) => {
		try {
			const payload = await context.req.json();

			const response = await this.modelService.createOne(context.env.D1DB, payload);
			return context.json(response);
		} catch (error) {
			throw error;
		}
	};

	getOne: Handler = async (context: AppContext) => {
		try {
			const response = await this.modelService.getOne(context.env.D1DB, context.req.param('id'));
			return context.json(response);
		} catch (error) {
			throw error;
		}
	};

	editOne: Handler = async (context: AppContext) => {
		try {
			const response = await this.modelService.editOne(context);
			return context.json(response);
		} catch (error) {
			throw error;
		}
	};

	deleteOne: Handler = async (context: AppContext) => {
		try {
			const response = await this.modelService.deleteOne(context);
			return context.json(response);
		} catch (error) {
			throw error;
		}
	};

	upload = async (context: AppContext) => {
		try {
			const response = await this.modelService.upload(context);
			return context.json(response);
		} catch (error) {
			throw error;
		}
	};
}
