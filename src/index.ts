import 'reflect-metadata';

import { Hono } from 'hono';
import { AppBindings, AppContext } from 'src/app/appBindings';
import { UserModule } from 'src/modules/user/user.module';

import { setCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { AuthModule } from 'src/modules/auth/auth.module';
import { GraphQLServer } from './graphQL/graphQL.server';
import { MyHTTPException } from './app/exceptions/MyHttpExceptions';
import { PostModule } from './modules/post/post.module';
import { ArticleModule } from './modules/article/article.module';
import { serveStatic } from 'hono/cloudflare-workers';
import { container } from 'tsyringe';
import { ArticleController } from './modules/article/article.controller';
import { InjectD1Middleware } from './app/middlewares/injectD1';
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
// app.use(async (c: AppContext, next) => {
// 	c.env.Container = weContainer;
// 	await next();
// });

app.get('/', (context) => {
	return context.json({
		success: true
	});
});
// app.use('/static/*', serveStatic({ root: './' }));

app.use('/graphql/*', GraphQLServer);

// console.log('server....init');

app.route('/users', new UserModule().route);
app.route('/auth', new AuthModule().route);

app.route('/articles', container.resolve(ArticleModule).route);
app.route('/posts', container.resolve(PostModule).route);

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
