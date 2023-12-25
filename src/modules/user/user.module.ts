import { Hono } from 'hono';
import { Singleton } from 'src/app/utils/singleton.util';
import { UserController } from 'src/modules/user/user.controller';



@Singleton
export class UserModule {
	private readonly userController = new UserController();
	readonly route = new Hono();

	constructor() {
		this.route.get('/', this.userController.getAll);
		this.route.get('/:id', this.userController.getOne);

		this.route.post('/', this.userController.createOne);
		this.route.put('/:id', this.userController.editOne);
		this.route.delete('/:id', this.userController.deleteOne);
        

	}
}

