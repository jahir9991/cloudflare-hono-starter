import { Handler } from 'hono';

import { AppContext } from 'src/app/appBindings';
import { PostService } from './post.service';
import { singleton, inject } from 'tsyringe';

@singleton()
export class PostController {
	// private readonly modelService: PostService = new PostService();

	constructor(@inject('PostService') private readonly modelService: PostService) {}

	getAll: Handler = async (context: AppContext) => {
		try {
			const options = {
				limit: Number(context.req.query('limit') ?? 10),
				page: Number(context.req.query('page') ?? 1),
				q: context.req.query('q') ?? ''
			};
			const selectedFields = JSON.parse(context.req.query('fields') ?? '[]') ?? [];

			const response = await this.modelService.getAll(context.env.D1DB, options, selectedFields);
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
			const DB = context.env.D1DB;
			const id = context.req.param('id');
			const newData = await context.req.json();
			const response = await this.modelService.editOne(DB, id, newData);
			return context.json(response);
		} catch (error) {
			throw error;
		}
	};

	deleteOne: Handler = async (context: AppContext) => {
		try {
			const DB = context.env.D1DB;
			const id = context.req.param('id');
			const response = await this.modelService.deleteOne(DB, id);
			return context.json(response);
		} catch (error) {
			throw error;
		}
	};
}
