
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import Role from 'src/modules/users/enum/role.enum';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import RequestWithUser from '../interface/requestUser.interface';
 
const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
 
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
 
      return user?.roles.includes(role);
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;