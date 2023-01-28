import { Injectable } from '@nestjs/common';
import {
  InferSubjects,
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { User } from 'src/modules/user/schemas/user.schema';
import { Task } from 'src/modules/tasks/schemas/task.schema';
import { Action } from 'src/shared/enums/action.enum';
import { UserI } from 'src/shared/interfaces/user.interface';
import { Role } from 'src/shared/enums/role.enum';

type Subjects = InferSubjects<typeof Task | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserI) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    );

    switch (user.role) {
      case Role.ADMIN:
        can(Action.MANAGE, 'all');
        break;
      case Role.AUDITOR:
        can(Action.MANAGE, Task);

        can(Action.READ, User, { id: user.id });
        can(Action.UPDATE, User, { id: user.id });
        cannot(Action.DELETE, User, { id: user.id });
        cannot(Action.CREATE, User);
        break;
      case Role.STAFF:
        can(Action.MANAGE, Task);

        can(Action.READ, User, { id: user.id });
        can(Action.UPDATE, User, { id: user.id });
        cannot(Action.DELETE, User, { id: user.id });
        cannot(Action.CREATE, User);
        break;
      case Role.USER:
        can(Action.READ, Task);
        cannot(Action.CREATE, Task);
        cannot(Action.UPDATE, Task);
        cannot(Action.DELETE, Task);

        can(Action.READ, User, { id: user.id });
        can(Action.UPDATE, User, { id: user.id });
        cannot(Action.DELETE, User, { id: user.id });
        cannot(Action.CREATE, User);
        break;
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
