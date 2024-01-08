import { Handler } from 'hono';
import { AppContext } from 'src/app/appBindings';
import { singleton, autoInjectable, container } from 'tsyringe';

@singleton()
export class ArticleController {
	getAll: Handler = async (context) => {
		return context.json({ name: 'article', page: 2 });
	};
}
