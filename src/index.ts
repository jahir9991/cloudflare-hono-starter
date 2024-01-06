import { Context, Hono } from 'hono';
import { AppBindings, AppContext } from 'src/app/appBindings';
import { UserModule } from 'src/modules/user/user.module';
import { InjectD1Middleware } from 'src/app/middlewares/injectD1';
import { setCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { AuthModule } from 'src/modules/auth/auth.module';

import { GraphQLServer } from './graphQL/graphQL.server';
import { MyHTTPException } from './app/exceptions/MyHttpExceptions';
import { PostModule } from './modules/post/post.module';
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
	return context.json({
		success: true
	});
});

app.use('/*', InjectD1Middleware);
app.use('/graphql/*', GraphQLServer);

app.route('/users', new UserModule().route);
app.route('/posts', new PostModule().route);

app.route('/auth', new AuthModule().route);

app.notFound((c) => {
	return c.text('Custom 404 Message', 404);
});

app.onError((err: any, c) => {
	console.log('calling on error');

	if (err instanceof MyHTTPException) {
		return c.json(err, {
			status: err.status
		});
	} else if (err instanceof HTTPException) {
		return c.json(
			new MyHTTPException(err.status, {
				message: err.message ?? 'unknown error',
				devMessage: err.message ?? 'unknown error'
			}),
			{
				status: err.status
			}
		);
	} else {
		return c.json(
			new MyHTTPException(500, {
				message: err.message ?? 'unknown error',
				devMessage: err.message ?? 'unknown error'
			}),

			{
				status: 500
			}
		);
	}
});

export default app;
