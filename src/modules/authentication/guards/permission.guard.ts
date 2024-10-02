import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import Permission from 'src/modules/users/permission/permission.type';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import RequestWithUser from '../interface/requestUser.interface';

const PermissionGuard = (permission: Permission): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.permissions.includes(permission);
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
