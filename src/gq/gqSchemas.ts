import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { UserService } from 'src/modules/user/user.service';

const typeDefinitions = /* GraphQL */ `
	type Query {
		users(q: String, limit: Int, page: Int): UsersResponse!
		user(id: ID!): User
	}

	type Meta {
		count: Int
		page: Int
		limit: Int
	}

	type User {
		id: String!
		username: String!
		email: String
		phoneNumber: String
		password: String
		role: String
		createdAt: String
		deletedAt: String
	}
	type UsersResponse {
		success: Boolean
		meta: Meta
		payload: [User]
	}
`;

const resolvers = {
	Query: {
		users: async (c, arg, context, info) => {
			try {
				console.log(arg.q);

				const result = await new UserService().getAll(context.env.MyDb, {
					q: arg.q,
					limit: arg.limit ?? 10,
					page: arg.page ?? 1
				});

				return result;
			} catch (error) {
				throw new GraphQLError(`User with id  not found.`);
			}
		},
		user: async (c, arg, context, info) => {
			try {
				const result = await new UserService().getOne(context.env.MyDb, arg.id);

				return result;
			} catch (error) {
				console.log(error);

				throw new GraphQLError(`User with id  not found.`);
			}
		}
	}
};

export const schema = makeExecutableSchema({
	resolvers: [resolvers],
	typeDefs: [typeDefinitions],
	
});
