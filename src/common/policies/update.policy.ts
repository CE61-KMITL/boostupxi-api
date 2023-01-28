import { AppAbility } from 'src/casl/factory/casl-ability.factory';
import { Task } from 'src/modules/tasks/schemas/task.schema';
import { Action } from 'src/shared/enums/action.enum';
import { PolicyHandlerI } from 'src/shared/interfaces/policy.interface';

export class UpdateTaskPolicyHandler implements PolicyHandlerI {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.UPDATE, Task);
  }
}
