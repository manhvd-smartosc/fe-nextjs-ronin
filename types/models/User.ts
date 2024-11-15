import { User } from '@prisma/client';

export type ProfileUpdateServiceData = Pick<User, 'name' | 'bio' | 'avatarUrl'>;
