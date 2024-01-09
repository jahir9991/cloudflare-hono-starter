import { Handler, Hono } from 'hono';
import { ArticleController } from './article.controller';
import { DI } from 'src/app/utils/DI.util';

DI.container.register('ArticleController', ArticleController);

@DI.singleton()
export class ArticleModule {
	readonly route = new Hono();

	constructor(@DI.inject('ArticleController') private articleController: ArticleController) {
		this.route.get('/', this.articleController.getAll);
	}
}
