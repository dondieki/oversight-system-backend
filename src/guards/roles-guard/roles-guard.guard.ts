import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());

   // // If no roles are required for this route, allow access
    // if (!requiredRoles) {
    //   return true;
    // }

    // const request = context.switchToHttp().getRequest();
    // const user: User = request.user; // Ensure user is correctly extracted from request

    // console.log({ user });

    // Check if the user exists and if their role matches one of the required roles
    // if (!user || !user.role || !requiredRoles.includes(user.role)) {
    //   throw new UnauthorizedException(
    //     'You do not have permission to access this resource',
    //   );
    // }

    return true;
  }
}
