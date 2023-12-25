import { Handler } from "hono";
import { AppBindings } from "src/app/appBindings";
import { injectD1 } from "src/db/dbconnect";

export const InjectD1Middleware:Handler<{ Bindings: AppBindings; }> =async (c,next)=>{
    await  injectD1(c);
    await next();
   }
   