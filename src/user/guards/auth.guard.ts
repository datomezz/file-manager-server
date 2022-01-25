import { CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { IRequestUser } from "../types/request-user.interface";

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<IRequestUser>();

    if (req.user) {
      return true;
    }

    throw new HttpException("Not Authorized", HttpStatus.UNAUTHORIZED);
  }
}