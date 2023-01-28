import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './factory/casl-ability.factory';
import { PoliciesGuard } from './guard/policies.guard';

@Module({
  providers: [CaslAbilityFactory, PoliciesGuard],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
