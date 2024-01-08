import { Handler, Hono } from 'hono';
import { ArticleController } from './article.controller';
import { singleton, injectable, autoInjectable, inject, container } from 'tsyringe';
container.register('ArticleController', ArticleController);

@singleton()
export class ArticleModule {
	readonly route = new Hono();

	constructor(@inject('ArticleController') private articleController: ArticleController) {
		this.route.get('/', this.articleController.getAll);
	}
}
