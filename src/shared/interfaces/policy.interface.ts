import { AppAbility } from 'src/casl/factory/casl-ability.factory';

export interface PolicyHandlerI {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = PolicyHandlerI | PolicyHandlerCallback;
