import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class CustomerDto {
    @ApiProperty({ example: 1, description: "Id del cliente" })
    @IsInt()
    @IsNotEmpty({ message: "The field id cannot be empty" })
    id: number;

    @ApiProperty({ example: "Felipe", description: "Nombre del cliente" })
    @IsString()
    @IsNotEmpty({ message: "The name field cannot be empty" })
    name: string;

    @ApiProperty({ example: "Hernandez", description: "Apellidos del cliente" })
    @IsString()
    @IsNotEmpty({ message: "The last_name field cannot be empty" })
    last_name: string;

    @ApiProperty({ example: "felipe@correo.com", description: "Correo electronico del cliente" })
    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: "The field email field cannot be empty" })
    email: string;

    @ApiProperty({ example: "+529224568790", description: "Numero telefonico del cliente" })
    @IsString()
    @Length(0, 12, { message: "The field aditional_number must be less than or equal to 12 characters" })
    @IsNotEmpty({ message: "The field contact_number field cannot be empty" })
    contact_number: string;

    @ApiProperty({ example: "2025-10-02 ...", description: "Fecha de creación del cliente" })
    @IsDate()
    @IsNotEmpty({ message: "The field contact_number field cannot be empty" })
    created_at: Date;

    @ApiProperty({ example: "2025-10-02 ...", description: "Fecha de ultima actualización" })
    @IsDate()
    @IsNotEmpty({ message: "The field contact_number field cannot be empty" })
    updated_at: Date;

    @ApiProperty({ example: "contraseña123", description: "Contraseña del cliente" })
    @IsOptional()
    @IsString()
    password: string | null;

    @ApiProperty({ example: false, description: "¿Es invitado o usuario registrado?" })
    @IsBoolean()
    @IsNotEmpty({ message: "The field is_guest cannot be empty" })
    is_guest: boolean;

    @ApiProperty({ example: "2025-10-02 ...", description: "Fecha de ultima sesión" })
    @IsDate()
    @IsOptional()
    @IsNotEmpty({ message: "The field contact_number field cannot be empty" })
    last_session: Date | null;
}

// DTO for create customers extended from CustomerDto with fields (name,last_name,email,contact_number,password,is_guest)
export class CreateCustomerDto extends OmitType(
    CustomerDto, [
    "id",
    "created_at",
    "updated_at",
    "last_session"
]) {
    // Retype password string | null -> string
    @IsString()
    @IsNotEmpty({ message: "The field password cannot be empty" })
    password: string;
}

// DTO for get customer data extended from CustomerDto with fields (id,name,last_name,email,created_at,is_guest)
export class GetCustomerDataDto extends OmitType(
    CustomerDto, [
    "updated_at",
    "password",
    "last_session",
    "contact_number",
    "created_at"
]) { }

// DTO for get customer detail
export class GetCustomerDetailDto extends OmitType(
    CustomerDto, ["password"]) { }

// DTO for update customer data extended from CustomerDto
export class CustomerUpdatePersonalDataDto extends PickType(
    CustomerDto, [
    "id",
    "name",
    "last_name"
]) { }

// DTO for update email of the customer
export class CustomerUpdateEmailDto extends PickType(
    CustomerDto, [
    "id",
    "email"
]) { }

// DTO for Map the Auth User data
export class AuthCustomerDto extends PickType(
    CustomerDto, [
    "id",
    "email",
    "name",
    "last_name",
    "is_guest"
]) { }

// DTO for Map the CustomerPayload data (id,email,name,is_guest)
// export class CustomerPayloadDto extends OmitType(
//     AuthCustomerDto, ["last_name", "name"]) {
//     @IsString()
//     full_name: string;
// }

// DTO for customer credentials
export class CustomerLoginDto extends PickType(CustomerDto, ["email", "password"]) {
    @IsString()
    @IsNotEmpty({ message: "The field password cannot be empty" })
    password: string;
}


export class ExitingAuthDto {
    @ApiProperty({ description: "Token de acceso" })
    @IsString()
    access_token: string;
}

export class CustomerRequestDto {
    @ApiProperty({ description: "Información del usuario autenticado", type: AuthCustomerDto })
    @Type(() => AuthCustomerDto)
    user: AuthCustomerDto;
}

export class CustomerAddressesDto {
    @ApiProperty({ example: 1, description: "ID de registro" })
    @IsNumber()
    @IsNotEmpty({ message: "The field id cannot be empty" })
    id: number;

    @ApiProperty({ example: 1, description: "ID del cliente" })
    @IsNumber()
    @IsNotEmpty({ message: "The field customer_id cannot be empty" })
    customer_id: number;

    @ApiProperty({ example: "Yon", description: "Nombre del destinatario" })
    @IsString()
    @IsNotEmpty({ message: "The field recipient_name cannot be empty" })
    recipient_name: string;

    @ApiProperty({ example: "Sina", description: "Apellidos del destinatario" })
    @IsString()
    @IsNotEmpty({ message: "The field recipient_last_name cannot be empty" })
    recipient_last_name: string;

    @ApiProperty({ example: "México", description: "Pais" })
    @IsString()
    @IsNotEmpty({ message: "The field country cannot be empty" })
    country: string;

    @ApiProperty({ example: "Veracruz", description: "Estado" })
    @IsString()
    @IsNotEmpty({ message: "The field state cannot be empty" })
    state: string;

    @ApiProperty({ example: "Coatzacoalcos", description: "Localidad" })
    @IsString()
    @IsNotEmpty({ message: "The field locality cannot be empty" })
    locality: string;

    @ApiProperty({ example: "Coatzacoalcos", description: "Ciudad o locación" })
    @IsString()
    @IsNotEmpty({ message: "The field city cannot be empty" })
    city: string;

    @ApiProperty({ example: "Calle #12", description: "Nombre de la calle" })
    @IsString()
    @IsNotEmpty({ message: "The field street cannot be empty" })
    street_name: string;

    @ApiProperty({ example: "Colonia #12", description: "Colonia, barrio, etc." })
    @IsString()
    @IsNotEmpty({ message: "The field neighborhood cannot be empty" })
    neighborhood: string;

    @ApiProperty({ example: "96230", description: "Codigo postal" })
    @IsString()
    @IsNumberString()
    @IsNotEmpty({ message: "The field zip_code cannot be empty" })
    zip_code: string;

    @ApiProperty({ example: "Casa", description: "Tipo de dirección (Casa,oficina,departamento,etc.)" })
    @IsString()
    @IsNotEmpty({ message: "The field address_type cannot be empty" })
    address_type: string;

    @ApiProperty({ description: "Numero de piso (si es departamento)", default: "N/A" })
    @IsString()
    @IsNumberString()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null || value === "") return "N/A";
    }, { toClassOnly: true })
    floor?: string | null;

    @ApiProperty({ example: "23", description: "Numero exterior de casa/edificio" })
    @IsString()
    @IsNotEmpty({ message: "The field number cannot be empty" })
    @Transform(({ value }) => {
        const text: string = value;
        return text.trim();
    })
    number: string;

    @ApiProperty({ description: "Numero interior de casa/departamento", default: "N/A" })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        return value === null || value === undefined || value === "" ? "N/A" : value
    }, { toClassOnly: true })
    aditional_number?: string | null;

    @ApiProperty({ example: "Casa verde 2 pisos", description: "Descripcion de la casa, referencias de direccion, etc.", default: "N/A" })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        return value === null || value === undefined || value === "" ? "N/A" : value
    }, { toClassOnly: true })
    references_or_comments?: string | null;

    @ApiProperty({ example: "+529225674509", description: "Numero telefonico del remitente" })
    @IsString()
    @Length(0, 12, { message: "The field aditional_number must be less than or equal to 12 characters" })
    @IsNotEmpty({ message: "The field contact_number cannot be empty" })
    @Transform(({ value }) => {
        const text: string = value;
        return text.trim();
    })
    contact_number: string;

    @ApiProperty({ example: false, description: "Esta es la direccion principal?" })
    @IsBoolean()
    @IsNotEmpty({ message: "The field default_address cannot be empty" })
    default_address: boolean;
}

export class NewAddressDto extends OmitType(CustomerAddressesDto, ['id', 'customer_id']) { }

export class UpdateAddressDto extends OmitType(CustomerAddressesDto, ["customer_id"]) { }