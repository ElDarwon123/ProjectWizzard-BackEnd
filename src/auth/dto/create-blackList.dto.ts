import { IsJWT } from "class-validator";

export class CreateBlackList {
    @IsJWT()
    token: string;
}