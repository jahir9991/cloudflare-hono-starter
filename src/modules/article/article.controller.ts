import { Handler } from 'hono';
import { AppContext } from 'src/app/appBindings';
import { DI } from 'src/app/utils/DI.util';

@DI.singleton()
export class ArticleController {
	getAll: Handler = async (context) => {
		return context.json({ name: 'article', page: 2 });
	};
}
