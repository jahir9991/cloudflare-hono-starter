import { Hono } from "hono";
import { AuthController } from "src/modules/auth/auth.controller";
import { Singleton } from "src/app/utils/singleton.util";
import { InjectD1Middleware } from "src/app/middlewares/injectD1";

@Singleton
export class AuthModule {
	private readonly authController=new AuthController();
	readonly route = new Hono().use(InjectD1Middleware);

	constructor() {
        this.route.post("/login", this.authController.login);
        this.route.post("/register", this.authController.register);
		
	}
}

