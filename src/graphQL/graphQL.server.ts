import { makeExecutableSchema } from '@graphql-tools/schema';
import { userResolver } from './resolvers/user.resolver';
import { userTypeDefinitions } from './typeDefs/user.typeDef';
import { postResolver } from './resolvers/post.resolver';
import { postTypeDefination } from './typeDefs/post.typeDef';
import { createYoga } from 'graphql-yoga';
import { useResponseCache } from '@graphql-yoga/plugin-response-cache';
import { globalTypeDefination } from './typeDefs/global.typeDef';
import { injectD1 } from 'src/db/dbconnect';
import { AppContext } from 'src/app/appBindings';

export const GraphQLServer = async (context) => {
	injectD1(context);

	return createYoga({
		schema: makeExecutableSchema({
			resolvers: [userResolver, postResolver],
			typeDefs: [globalTypeDefination, userTypeDefinitions, postTypeDefination]
		}),
		context,
		landingPage: false,
		multipart: true,
		cors: true,
		logging: 'debug',

		plugins: [
			useResponseCache({
				session: () => null,
				ttl: 2_000
			})
		]
	}).handle(context.req, context);
};
