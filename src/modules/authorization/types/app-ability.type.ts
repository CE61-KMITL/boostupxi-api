import { Ability, InferSubjects } from '@casl/ability';
import { User } from 'src/modules/user/schemas/user.schema';
import { Action } from '../enums/action.enum';

export type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;
