import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { IRequestUser } from "./types/request-user.interface";
import { TokenModel } from "./token.model";
import { UserService } from "./user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) { }

  async use(req: IRequestUser, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = await TokenModel.verifyAccessToken(token);
      const user = await this.userService.findUserByName(decode.username);

      req.user = {
        username : user.username
      }

      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }

}