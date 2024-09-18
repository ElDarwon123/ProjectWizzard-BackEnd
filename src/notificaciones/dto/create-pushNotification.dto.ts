import { ApiProperty } from "@nestjs/swagger"

export class CreatePushNotification{
    @ApiProperty()
    token: string
    @ApiProperty()
    title: string
    @ApiProperty()
    body: string
}