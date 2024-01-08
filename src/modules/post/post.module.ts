import { Hono } from 'hono';
import { PostController } from './post.controller';
import { InjectD1Middleware } from 'src/app/middlewares/injectD1';
import { singleton, inject, container } from 'tsyringe';
import { PostService } from './post.service';

container.register('PostController', PostController);
container.register('PostService', PostService);
@singleton()
export class PostModule {
	readonly route = new Hono().use(InjectD1Middleware);

	constructor(@inject('PostController') private modelController: PostController) {
		this.route.get('/', this.modelController.getAll);
		this.route.get('/:id', this.modelController.getOne);

		this.route.post('/', this.modelController.createOne);
		this.route.put('/:id', this.modelController.editOne);
		this.route.delete('/:id', this.modelController.deleteOne);
	}
}
