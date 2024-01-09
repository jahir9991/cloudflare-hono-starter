import { Hono } from 'hono';
import { AuthController } from 'src/modules/auth/auth.controller';
import { InjectD1Middleware } from 'src/app/middlewares/injectD1';
import { DI } from 'src/app/utils/DI.util';

@DI.singleton()
export class AuthModule {
	private readonly authController = new AuthController();
	readonly route = new Hono().use(InjectD1Middleware);

	constructor() {
		this.route.post('/login', this.authController.login);
		this.route.post('/register', this.authController.register);
	}
}
