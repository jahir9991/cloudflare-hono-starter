import { Hono } from 'hono';
import { AppBindings } from 'src/app/appBindings';
import { UserModule } from 'src/modules/user/user.module';
import { InjectD1Middleware } from 'src/app/middlewares/injectD1';
import { setCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { AuthModule } from 'src/modules/auth/auth.module';

const app = new Hono<{ Bindings: AppBindings }>();

// app.use(
//     "/*",
//    cors({
//       origin: ["http://localhost:5173", "https://medsir.pages.dev"],
//       credentials: true,
//       allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
//       allowHeaders: [
//         "Access-Control-Allow-Credentials",
//         "Access-Control-Allow-Origin",
//       ],
//     })
//   );
app.use(cors());

app.get('/', (context) => {
	return context.json(context.env);
});

app.use('/*', InjectD1Middleware);
app.route('/users', new UserModule().route);
app.route('/auth', new AuthModule().route);

app.onError((err, c) => {
	console.log('opopopo');

	if (err instanceof HTTPException) {


		return c.json(
			{
				success: false,
				message: err.getResponse()??'wrong',
				devMessage: err.getResponse()??'error...'
				// error:err
			},
			{
				status: err.status
			}
		);
	}
});

export default app;
