import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { getGraphQlField } from 'src/app/utils/getGraphQlFeild.util';
import { UserService } from 'src/modules/user/user.service';

const getAll = async (_, arg, context, info: GraphQLResolveInfo) => {
	try {
		const selectedFields = getGraphQlField(info.fieldNodes[0].selectionSet);
		console.log(selectedFields);

		const result = await new UserService().getAll(
			context.env.D1DB,
			{
				q: arg.q,
				limit: arg.limit ?? 10,
				page: arg.page ?? 1
			},
			selectedFields.payload?.keys ?? [],
			selectedFields.meta ?? false
		);

		return result;
	} catch (error) {
		throw new GraphQLError(`User with id  not found.`);
	}
};

const getOne = async (c, arg, context, info) => {
	try {
		const result = await new UserService().getOne(context.env.D1DB, arg.id);

		return result;
	} catch (error) {
		console.log(error);

		throw new GraphQLError(`User with id  not found.`);
	}
};

export const userResolver = {
	Query: {
		users: getAll,
		user: getOne
	}
};
