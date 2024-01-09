import { Handler } from 'hono';
import { AppContext } from 'src/app/appBindings';
import { AuthService } from 'src/modules/auth/auth.service';
import { DI } from 'src/app/utils/DI.util';

@DI.singleton()
export class AuthController {
	private readonly authService: AuthService = new AuthService();

	constructor() {}

	login: Handler = (context: AppContext) => {
		return this.authService.login(context);
	};

	register: Handler = (context: AppContext) => {
		return this.authService.register(context);
	};
}
