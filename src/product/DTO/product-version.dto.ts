import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { GetProductImagesDto } from "./product-resources.dto";
import { IsArray, IsBoolean, IsDate, IsDecimal, IsEmpty, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Decimal } from "generated/prisma/runtime/library";
import { ProductDto } from "./product.dto";
import { type } from "os";

export class AddProductVersionDto {
    @ApiProperty({ example: 5 })
    @IsNotEmpty({ message: "The product_id field cannot be empty" })
    @IsNumber()
    @Type(() => Number)
    product_id: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: "The sku field cannot be empty" })
    @IsNumber()
    @Type(() => Number)
    sku: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    code_bar?: number;

    @ApiProperty({ example: "Linea Basica" })
    @IsNotEmpty({ message: "The color_line field cannot be empty" })
    color_line: string;

    @ApiProperty({ example: "amarillo" })
    @IsNotEmpty({ message: "The color_name field cannot be empty" })
    color_name: string;

    @ApiProperty({ example: "#edf500" })
    @IsNotEmpty({ message: "The color_code field cannot be empty" })
    color_code: string;

    @ApiProperty({ example: "DISPONIBLE" })
    @IsNotEmpty({ message: "The status field cannot be empty" })
    status: string;

    @ApiProperty({ example: 15 })
    @IsNotEmpty({ message: "The stock field cannot be empty" })
    @IsNumber()
    @Type(() => Number)
    stock: number;

    @ApiProperty({ example: 224.59 })
    @IsNotEmpty({ message: "The unit_price field cannot be empty" })
    @IsNumber()
    @Type(() => Number)
    unit_price: number;

    @ApiProperty({ example: true })
    @IsNotEmpty({ message: "The color_code field cannot be empty" })
    @IsBoolean()
    main_version: boolean;
}

export class ProductVersionCreatedDto {
    @ApiProperty()
    product_id: number;

    @ApiProperty()
    sku: number;

    @ApiProperty()
    @IsOptional()
    code_bar: number | null;

    @ApiProperty()
    attributes: string[];

    @ApiProperty()
    color_line: string;

    @ApiProperty()
    color_name: string;

    @ApiProperty()
    color_code: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    stock: number;

    @ApiProperty()
    unit_price: Decimal;

    @ApiProperty()
    main_version: boolean;
}

export class ProductVersionDto {
    @ApiProperty({ description: "ID de la versión de producto" })
    product_id: number;

    @ApiProperty({ description: "SKU de la versión de producto" })
    sku: number;

    @ApiProperty({ description: "Atributos del producto", type: [String], default: [] })
    @IsArray()
    attributes: string[];

    @ApiProperty({ description: "Precio unitario del producto" })
    unit_price: Decimal;

    @ApiProperty({ description: "Imágenes del producto", type: [GetProductImagesDto], default: [] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GetProductImagesDto)
    product_images: GetProductImagesDto[];

    @ApiProperty({ description: "Informacion del padre", type: ProductDto })
    @Type(() => ProductDto)
    product: ProductDto
}


export class AddProductToFavoritesDto {
    @ApiProperty({ example: 5 })
    @IsNumber()
    @IsNotEmpty({ message: "The customer_id field cannot be empty" })
    @Type(() => Number)
    customer_id: number

    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty({ message: "The product_id field cannot be empty" })
    @Type(() => Number)
    product_version_id: number
}

export class ProductAddedToFavDto {
    @ApiProperty()
    @IsNumber()
    customer_id: number;

    @ApiProperty()
    @IsNumber()
    product_version_id: number;

    @ApiProperty()
    @IsDate()
    agg_date: Date;

}

export class RemoveFromFavoritesDto {
    @ApiProperty({ example: 5 })
    @IsNumber()
    @Type(() => Number)
    user_id: number;

    @ApiProperty({ example: 4 })
    @IsNumber()
    @Type(() => Number)
    product_version_id: number;
}

export class GetProductPerSubcategoryDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty({ message: "The category_id field cannot be empty" })
    category_id: number;

    @ApiProperty({ example: [1, 2, 3] })
    @IsArray()
    @Type(() => Number)
    @IsInt({ each: true })
    @IsNotEmpty({ each: true, message: "The path field cannot be empty" })
    path: number[];
}

export class GetProductNameDto {
    @ApiProperty({ description: "Nombre del Producto" })
    @IsString()
    product_name: string;

}

export class ProductVerCardDto {
    @ApiProperty({ description: "ID de version del producto" })
    @IsNumber()
    product_id: number;

    @ApiProperty({ description: "SKU del producto" })
    @IsNumber()
    sku: number;

    @ApiProperty({ description: "Atributos del producto", type: [String] })
    @IsString()
    @IsArray()
    attributes: String[];

    @ApiProperty({ description: "Precio unitario del producto" })
    @IsDecimal()
    unit_price: Decimal;

    @ApiProperty({ description: "Imágenes del producto", type: [GetProductImagesDto], default: [] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GetProductImagesDto)
    product_images: GetProductImagesDto[];

    @ApiProperty({ description: "Url de la imagen principal", type: [GetProductNameDto] })
    @Type(() => GetProductNameDto)
    product: GetProductNameDto;
}

// Dto for getProductCardPerSubcategory with queryRaw
export class ProductVerCardPlainDto {
    @ApiProperty({ description: "ID de version del producto" })
    @IsNumber()
    product_id: number;

    @ApiProperty({ description: "SKU del producto" })
    @IsNumber()
    sku: number;

    @ApiProperty({ description: "Precio unitario del producto" })
    @IsDecimal()
    unit_price: Decimal;

    @ApiProperty({ description: "Atributos del producto", type: [String] })
    @IsString()
    @IsArray()
    attributes: String[];

    @ApiProperty({ description: "Nombre del producto" })
    product_name: String;

    @ApiProperty({ description: "Url de la imagen principal" })
    main_image_url: String | null;
}