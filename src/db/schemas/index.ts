import { PostD1 } from './Post.entity';
import { UserD1 } from './User.entity';

export const schemaD1: any = { ...PostD1, ...UserD1 };
