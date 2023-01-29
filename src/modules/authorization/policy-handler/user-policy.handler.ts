import { AppAbility } from '../types/app-ability.type';
import { Action } from '../enums/action.enum';
import { User } from 'src/modules/user/schemas/user.schema';
import { IPolicyHandler } from '../interfaces/policy-handler.interface';

export class ReadUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.READ, User);
  }
}

export class CreateUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.CREATE, User);
  }
}

export class UpdateUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.UPDATE, User);
  }
}

export class DeleteUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.DELETE, User);
  }
}
