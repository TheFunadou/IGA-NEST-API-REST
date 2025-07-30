import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, MinLength,IsBoolean, IsDate, IsInt, IsString, Min } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: "yonsina" })
    @IsNotEmpty({ message: "The username cannot be empty" })
    username: string;

    @ApiProperty({ example: "Juan" })
    @IsNotEmpty({ message: "The name cannot be empty" })
    name: string;

    @ApiProperty({ example: "Cena" })
    @IsNotEmpty({ message: "The last name cannot be empty" })
    last_name: string;

    @ApiProperty({ example: "juancena@email.com" })
    @IsEmail({}, { message: "The email isnt valid" })
    email: string;

    @ApiProperty({ example: "false"})
    @IsBoolean({message:"The value provided must be boolean"})
    is_superuser: boolean;

    @ApiProperty({ example: "mypassword123"})
    @MinLength(5,{message: "The password must have more than 5 characters"})
    password: string;
}

export class GetUsersByNameDto {

    @ApiProperty({ example: "yonsina" })
    @IsString()
    @IsNotEmpty({message: "the field name_or_username cannot be empty"})
    name_or_username:string;

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number;

    @ApiProperty({ example: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number;
}

export class UserLogDto{
    @ApiProperty({example:"Inserta una descripcion"})
    @IsNotEmpty({ message: "The description cannot be empty"})
    description:string;

    @ApiProperty({example:"ID de usuario que realizo la acción"})
    @IsNotEmpty({ message: "The user_id cannot be empty"})
    user_id:number;
}

export class GetUsersDto{
    @ApiProperty()
    id:number;
    
    @ApiProperty()
    username:string;

    @ApiProperty()
    name:string;

    @ApiProperty()
    last_name:string;

    @ApiProperty()
    email:string;

    @ApiProperty()
    @IsDate()
    created_at:Date;
}

export class UserCreatedDto{
    @ApiProperty()
    id:number;

    @ApiProperty()
    username:string;

    @ApiProperty()
    email:string;
}

export class UserEliminatedDto{
    @ApiProperty({example: "Usuario eliminado."})
    message:string;
}

