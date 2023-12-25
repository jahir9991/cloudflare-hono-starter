import { Handler } from 'hono';

import { Singleton } from 'src/app/utils/singleton.util';
import { AppContext } from 'src/app/appBindings';
import { UserService } from 'src/modules/user/user.service';

// const log = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
// 	const originalMethod = descriptor.value;
// 	console.log('originalMethod', originalMethod);
// 	descriptor.value = function (...args: any[]) {
// 		let msg: string;
// 		// The decorated method's parameters will be passed in as args.
// 		// We'll assume the decorated method might only have a single parameter,
// 		// check to see if it's been passed in the method
// 		if (args[0]) {
// 			msg = `${propertyKey}, that has a parameter value: ${args[0]}`;
// 		} else {
// 			msg = `${propertyKey}`;
// 		}
// 		// Emit a message to the console
// 		console.log(`Logger says - calling the method: ${msg}`);
// 		// Execute the behavior originally programmed in
// 		// the decorated method
// 		const result = originalMethod.apply(this, args);
// 		// if the decorated method returned a value when executed,
// 		// capture that result
// 		if (result) {
// 			msg = `${propertyKey} and returned: ${JSON.stringify(result)}`;
// 		} else {
// 			msg = `${propertyKey}`;
// 		}
// 		// Having executed the decorated method's behavior, emit
// 		// a message to the console report what happened
// 		console.log(`Logger says - called the method: ${msg}`);
// 		return result;
// 	};
// 	return descriptor;
// };

@Singleton
export class UserController {
	private readonly modelService: UserService = new UserService();

	getAll: Handler = (context: AppContext) => {
		return this.modelService.getAll(context);
	};

	createOne: Handler = (context: AppContext) => {
		return this.modelService.createOne(context);
	};

	getOne: Handler = (context: AppContext) => {
		return this.modelService.getOne(context);
	};

	editOne: Handler = (context: AppContext) => {
		return this.modelService.editOne(context);
	};

	deleteOne: Handler = (context: AppContext) => {
		return this.modelService.deleteOne(context);
	};

	upload = async (context: AppContext) => {
		return this.modelService.upload(context);
	};
}
