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
    }

    if (user.role === 'staff') {
    }

    if (user.role === 'user') {
    }

    cannot(Action.CREATE, User);
    cannot(Action.DELETE, User);
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
