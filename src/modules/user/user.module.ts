import { Hono } from 'hono';
import { InjectD1Middleware } from 'src/app/middlewares/injectD1';
import { DI } from 'src/app/utils/DI.util';
import { UserController } from 'src/modules/user/user.controller';

@DI.singleton()
export class UserModule {
	private readonly modelController = new UserController();
	readonly route = new Hono().use(InjectD1Middleware);

	constructor() {
		this.route.get('/', this.modelController.getAll);
		this.route.get('/:id', this.modelController.getOne);

		this.route.post('/', this.modelController.createOne);
		this.route.put('/:id', this.modelController.editOne);
		this.route.delete('/:id', this.modelController.deleteOne);
	}
}
