import { Hono } from 'hono';
import { InjectD1Middleware } from 'src/app/middlewares/injectD1';
import { DI } from 'src/app/utils/DI.util';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from './user.service';

export const UserModule = () => {
	DI.container.register('UserService', UserService);
	const modelController = DI.container.resolve(UserController);

	const route = new Hono();

	route.get('/', modelController.getAll).get('/:id', modelController.getOne);
	route.post('/', modelController.createOne);
	route.put('/:id', modelController.editOne);
	route.delete('/:id', modelController.deleteOne);

	return route;
};
