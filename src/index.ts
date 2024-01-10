import { Hono } from 'hono';
import { AppBindings, AppContext } from 'src/app/appBindings';
import { UserModule } from 'src/modules/user/user.module';

import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { AuthModule } from 'src/modules/auth/auth.module';
import { GraphQLServer } from './graphQL/graphQL.server';
import { MyHTTPException } from './app/exceptions/MyHttpExceptions';
import { PostModule } from './modules/post/post.module';
import { ArticleModule } from './modules/article/article.module';
import { serveStatic } from 'hono/cloudflare-workers';
import { setCookie } from 'hono/cookie';

import { DI } from './app/utils/DI.util';
import { InjectD1Middleware } from './app/middlewares/injectD1';
import { timing } from 'hono/timing';
const app = new Hono<{ Bindings: AppBindings }>();
console.log(app);
app.use('*', timing());

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
// app.use('/static/*', serveStatic({ root: './' }));

['/graphql/*', '/auth/*', '/users/*', '/posts/*', '/articles/*'].forEach((routes) => {
	app.use(routes, InjectD1Middleware);
});

app.use('/graphql/*', GraphQLServer);

// console.log('server....init');
app.route('/auth', DI.container.resolve(AuthModule).route);
app.route('/articles', DI.container.resolve(ArticleModule).route);
app.route('/posts', DI.container.resolve(PostModule).route);
app.route('/users', DI.container.resolve(UserModule).route);

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
