import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class CreateBlackList {
  @ApiProperty()
  @IsJWT()
  token: string;
}