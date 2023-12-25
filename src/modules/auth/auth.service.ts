import { Handler } from 'hono';
import { AppContext } from 'src/app/appBindings';
import { BcryptHelper } from 'src/app/helpers/bcrypt.helper';
import { UserD1 } from 'src/db/schemas/User.entity';
import { UserService } from 'src/modules/user/user.service';
import { HTTPException } from 'hono/http-exception';
import { JWTHelper } from 'src/app/helpers/jwt.helper';
import { Utils } from 'src/app/utils';
import { Singleton } from 'src/app/utils/singleton.util';
import { HttpStatus } from 'src/app/helpers/httpStatus.enum';

@Singleton
export class AuthService {
	private readonly usersService: UserService = new UserService();

	login = async (context: AppContext) => {
		try {
			const DB = context.env.MyDb;

			const payload = await context.req.json();

			const existUser = await this.usersService.fineByUserName(payload.username, DB);

			if (!existUser) {
				throw new HTTPException(HttpStatus.UNAUTHORIZED, {
					message: 'username is incorrect!'
				});
			} else {
				const isCorrectPassword = await BcryptHelper.compare(
					payload.password,
					`${existUser.password}`
				);

				if (!isCorrectPassword)
					throw new HTTPException(HttpStatus.UNAUTHORIZED, {
						message: 'Incorrect password!'
					});
			}
			const accessToken = await JWTHelper.makeAccessToken({
				user: {
					id: existUser.id,
					role: existUser.role,
					username: existUser.username,
					email: existUser.email,
					phoneNumber: existUser.phoneNumber
				}
			});

			const refreshToken = await JWTHelper.makeRefreshToken({
				user: {
					id: existUser.id,
					role: existUser.role,
					username: existUser.username,
					email: existUser.email,
					phoneNumber: existUser.phoneNumber
				},
				isRefreshToken: true
			});

			const responsePayload = Utils.exclude(existUser, ['password']);

			return context.json({
				payload: { ...responsePayload, accessToken, refreshToken }
			});
		} catch (error) {
			console.log(error);

			return context.json({ error: error });
		}
	};
	register = async (context: AppContext) => {
		try {
			const DB = context.env.MyDb;

			const payload = await context.req.json();
			payload.password = await BcryptHelper.hash(payload.password);

			const result = await DB.insert(UserD1).values(payload).returning();

			return context.json({
				payload: result[0] ?? {}
			});
		} catch (error) {
			console.log(error);

			return context.json({ error: error });
		}
	};
}
