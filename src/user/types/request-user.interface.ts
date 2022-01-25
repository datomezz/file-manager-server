import { Request } from "express";

interface IUserToken {
  username: string;
}


export interface IRequestUser extends Request {
  user: IUserToken;
}