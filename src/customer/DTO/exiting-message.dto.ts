import { ApiProperty } from "@nestjs/swagger";

export class CustomerExitingDto{
    @ApiProperty({description: "Mensaje de exito"})
    message: string;
}
