import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, ValidateNested } from "class-validator";
import { GetProductSourcesDto } from "./product-resources.dto";
import { GetMainCategoryDto } from "src/categories/DTO/categories.dto";

export class CreateNewProductDto {
    @ApiProperty({ example: "IGA casco de seguridad dielectrico" })
    @IsNotEmpty({ message: "The product_name field cannot be empty" })
    product_name: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: "The category_id field cannot be empty" })
    category_id: number;

    @ApiProperty({ example: [1, 2, 3] })
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsInt({ each: true })
    attributes: number[];

    @ApiProperty({ example: "Casco para trabajo pesado en el sector industrial." })
    @IsNotEmpty({ message: "The specs field cannot be empty" })
    specs: string;

    @ApiProperty({ example: "Dejarse en lugares secos y no exponer al sol por mucho tiempo." })
    @IsNotEmpty({ message: "The recommendations field cannot be empty" })
    recomendations: string;

    @ApiProperty({ example: "applications any description" })
    @IsNotEmpty({ message: "The applications field cannot be empty" })
    applications: string;

    @ApiProperty({ example: "certifications_desc any description" })
    @IsNotEmpty({ message: "The certifications_desc field cannot be empty" })
    certifications_desc: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: "The user_id field cannot be empty" })
    user_id: number;
}

export class ProductCreatedDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    category_id: number;

    @ApiProperty()
    product_name: string;

    @ApiProperty()
    specs: string;

    @ApiProperty()
    recomendations: string;

    @ApiProperty()
    applications: string;

    @ApiProperty()
    certifications_desc: string;

    @ApiProperty()
    updated_at: Date;
}


export class ProductDto {
    @ApiProperty({ description: "Nombre del producto" })
    product_name: string;

    @ApiProperty({ description: "Especificaciones del producto" })
    specs: string;

    @ApiProperty({ description: "Recomendaciones del producto" })
    recomendations: string;

    @ApiProperty({ description: "Aplicaciones del producto" })
    applications: string;

    @ApiProperty({ description: "Descripción de las certificaciones" })
    certifications_desc: string;

    @ApiProperty({ type: GetMainCategoryDto, description: "Categoría del producto" })
    @Type(() => GetMainCategoryDto)
    category: GetMainCategoryDto;

    @ApiProperty({
        type: [GetProductSourcesDto],
        description: "Recursos del producto (fichas técnicas, certificaciones)",
        default: [],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GetProductSourcesDto)
    product_sources: GetProductSourcesDto[];
}
