import { Handler } from 'hono';
import { AppContext } from 'src/app/appBindings';
import { BcryptHelper } from 'src/app/helpers/bcrypt.helper';
import { UserD1 } from 'src/db/schemas/User.entity';
import { UserService } from 'src/modules/user/user.service';
import { HTTPException } from 'hono/http-exception';
import { JWTHelper } from 'src/app/helpers/jwt.helper';
import { Utils } from 'src/app/utils';
import { HttpStatus } from 'src/app/exceptions/httpStatus.enum';
import { DI } from 'src/app/utils/DI.util';

@DI.singleton()
export class AuthService {
	private readonly userService: UserService = DI.container.resolve(UserService);

	login = async (context: AppContext) => {
		try {
			const DB = context.env.D1DB;

			const payload = await context.req.json();

			const response = await this.userService.fineByUserName(DB, payload.username);
			const existUser = response.payload;
			if (!response.success) {
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
			const DB = context.env.D1DB;

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
