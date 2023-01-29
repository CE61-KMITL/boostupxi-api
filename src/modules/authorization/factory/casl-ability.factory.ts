import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  Ability,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { User } from 'src/modules/user/schemas/user.schema';
import { Action } from '../enums/action.enum';
import { AppAbility, Subjects } from '../types/app-ability.type';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === 'auditor') {
      cannot(Action.CREATE, User);
    }

    if (user.role === 'staff') {
      cannot(Action.CREATE, User);
    }

    if (user.role === 'user') {
      cannot(Action.CREATE, User);
    }

    can(Action.READ, User, { _id: user._id });
    cannot(Action.READ, User);
    cannot(Action.DELETE, User, { _id: user._id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
