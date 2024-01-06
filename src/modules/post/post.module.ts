import { Hono } from 'hono';
import { Singleton } from 'src/app/utils/singleton.util';
import { PostController } from './post.controller';

@Singleton
export class PostModule {
	private readonly modelController = new PostController();
	readonly route = new Hono();

	constructor() {
		this.route.get('/', this.modelController.getAll);
		this.route.get('/:id', this.modelController.getOne);

		this.route.post('/', this.modelController.createOne);
		this.route.put('/:id', this.modelController.editOne);
		this.route.delete('/:id', this.modelController.deleteOne);
	}
}
