import { Hono } from 'hono';
import { PostController } from './post.controller';
import { InjectD1Middleware } from 'src/app/middlewares/injectD1';
import { PostService } from './post.service';
import { DI } from 'src/app/utils/DI.util';

DI.container.register('PostController', PostController);
DI.container.register('PostService', PostService);
@DI.singleton()
export class PostModule {
	readonly route = new Hono();

	public get getRoute(): Hono {
		return this.route;
	}

	constructor(@DI.inject('PostController') private modelController: PostController) {
		this.route.get('/', this.modelController.getAll);
		this.route.get('/:id', this.modelController.getOne);

		this.route.post('/', this.modelController.createOne);
		this.route.put('/:id', this.modelController.editOne);
		this.route.delete('/:id', this.modelController.deleteOne);
	}
}
