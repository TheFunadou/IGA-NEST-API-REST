import { ApiProperty } from "@nestjs/swagger"

export class SourceCreatedDto {
    @ApiProperty({example: "Recursos añadidos exitosamente"})
    message:string;
}