import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty({ example: "Felipe" })
    @IsString()
    @IsNotEmpty({ message: "The name field cannot be empty" })
    name: string;

    @ApiProperty({ example: "Chen" })
    @IsString()
    @IsNotEmpty({ message: "The last_name field cannot be empty" })
    last_name: string;

    @ApiProperty({ example: "felipe@correo.com" })
    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: "The field email field cannot be empty" })
    email: string;

    @ApiProperty({ example: "+529225678976" })
    @IsString()
    @IsString()
    @IsNotEmpty({ message: "The field contact_number field cannot be empty" })
    contact_number: string;

    @ApiProperty({ example: "contraseña123" })
    @IsString()
    password: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsNotEmpty({ message: "The field is_guest cannot be empty" })
    is_guest: boolean;
}

export class CustomerCreatedDto {
    @ApiProperty({description: "ID del cliente"})
    id: number;

    @ApiProperty({description: "Nombre del cliente"})
    name: string;

    @ApiProperty({description: "Apellidos del cliente"})
    last_name: string;

    @ApiProperty({description: "Email del cliente"})
    email: string;

    @ApiProperty({description: "Numero telefonico del cliente"})
    contact_number: string;

    @ApiProperty({description: "Fecha de creacion del cliente"})
    created_at: Date;

    @ApiProperty({description: "¿Es invitado o cliente registrado?"})
    is_guest: boolean;

}

export class CustomerUpdatePersonalDataDto {
    @ApiProperty({ example: 5 })
    @IsNumber()
    @Type(() => Number)
    id: number;

    @ApiProperty({ example: "fabian" })
    @IsString()
    @IsNotEmpty({ message: "The field name field cannot be empty" })
    name: string;

    @ApiProperty({ example: "martinez" })
    @IsString()
    @IsNotEmpty({ message: "The field last_name field cannot be empty" })
    last_name: string;
}


export class CustomerUpdateContactNumberDto {
    @ApiProperty({ example: 5 })
    @IsNumber()
    @Type(() => Number)
    id: number;

    @ApiProperty({ example: "+529228763467" })
    @IsString()
    @IsNotEmpty({ message: "The field contact_number field cannot be empty" })
    contact_number: string;
}

export class CustomerUpdateEmailDto {
    @ApiProperty({ example: 5 })
    @IsNumber()
    @Type(() => Number)
    id: number;

    @ApiProperty({ example: "fabian@correo.com" })
    @IsString()
    @IsNotEmpty({ message: "The field email field cannot be empty" })
    email: string;
}

export class GetCustomerDto{
    @ApiProperty({description: "ID del cliente"})
    @IsString()
    id: number;

    @ApiProperty({description: "Nombre del cliente"})
    @IsString()
    name: string;
    
    @ApiProperty({description: "Apellidos del cliente"})
    @IsString()
    last_name:string;
    
    @ApiProperty({description: "Email del cliente"})
    @IsEmail()
    email:string;
    
    @ApiProperty({description: "¿Es invitado o usuario registrado?"})
    @IsBoolean()
    is_guest:boolean;
}

export class GetCustomerDetailDto{
    @ApiProperty({description: "ID del cliente"})
    @IsString()
    id: number;

    @ApiProperty({description: "Nombre del cliente"})
    @IsString()
    name: string;
    
    @ApiProperty({description: "Apellidos del cliente"})
    @IsString()
    last_name:string;

    @ApiProperty({description: "Email del cliente"})
    @IsEmail()
    email:string;

    @ApiProperty({description: "Numero telefonico del cliente"})
    @IsString()
    contact_number:string;

    @ApiProperty({description: "Fecha de creación"})
    @IsDate()
    created_at:Date;

    @ApiProperty({description: "Ultima actualización"})
    @IsDate()
    updated_at:Date;
    
    @ApiProperty({description: "¿Es invitado o usuario registrado?"})
    @IsBoolean()
    is_guest:boolean;

    @ApiProperty({description: "¿Es invitado o usuario registrado?"})
    @IsDate()
    @IsOptional()
    last_sesion?:Date;

}


export class CustomerLoginDto{
    @ApiProperty({example: "alguien@correo.com.mx"})
    @IsEmail()
    email:string;

    @ApiProperty({example: "contraseña123"})
    @IsString()
    password:string;
}

export class ExitingAuthDto{
    @ApiProperty({description: "Token de acceso"})
    @IsString()
    access_token: string;

    @ApiProperty({description: "Datos del cliente autenticado",type: GetCustomerDto})
    @Type(()=>GetCustomerDto)
    customer: GetCustomerDto;
    
}

