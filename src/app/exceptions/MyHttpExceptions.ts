import { StatusCode } from 'hono/utils/http-status';

export class MyHTTPException extends Error {
	readonly status: StatusCode;
	readonly message: string;
	readonly devMessage: string;
	readonly error: any;
	constructor(status: StatusCode, options: { message: string; devMessage?: string; error?: any }) {
		super(options?.message);
		this.status = status;
		this.message = options.message;
		this.devMessage = options.devMessage ?? options.message;
		this.error = options.error;
	}
}
