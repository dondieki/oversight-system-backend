import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';  // Import jwt to handle token-related errors

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Check if the error exists or the user is missing
    if (err || !user) {
      if (info instanceof jwt.TokenExpiredError) {
        // Handle expired token
        throw new ForbiddenException({
          Status: 403,
          Message: 'Token has expired',
        });
      } else if (info instanceof jwt.JsonWebTokenError) {
        // Handle invalid token
        throw new UnauthorizedException({
          Status: 401,
          Message: 'Invalid token',
        });
      } else {
        // Handle any other token-related issues
        throw new UnauthorizedException({
          Status: 401,
          Message: 'Token validation error',
        });
      }
    }
    // Return the user if no issues
    return user;
  }
}
