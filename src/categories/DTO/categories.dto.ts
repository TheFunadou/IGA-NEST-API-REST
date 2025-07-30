import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({ example: "Cascos de seguridad industrial", description: "Nombre de la categoria"})
    @IsNotEmpty({ message: "The category_name field cannot be empty" })
    name:string;
}

export class DeleteCategoryAttDto {
    @ApiProperty({ example: [2,3], required: false, type: [Number], description: "path de id de subcategorias" })
    @IsArray({message: "ids_path must be an array"})
    @IsInt({each:true , message:"Each item in ids_path must be an Integer"}) //Check if the elements in the path are integer type
    @Type(() => Number)
    path: number[] = [];

}

export class InsertCategoryAttDto {
    @ApiProperty({ example: 1, description: "ID de categoria"})
    @IsNotEmpty({ message: "The category_id field cannot be empty" })
    @Type(() => Number)
    @IsInt()
    category_id: number;

    @ApiProperty({ example: "Ala completa", description: "Descripcion de la subcategoria" })
    @IsNotEmpty({ message: "The description field cannot be empty" })
    description: string;

    @ApiProperty({ example: [2], required: false, type: [Number], description: "Path raiz en donde se insertara la nueva subcategoria" })
    @IsArray({message: "ids_path must be an array"})
    @IsInt({each:true , message:"Each item in ids_path must be an Integer"}) //Check if the elements in the path are integer type
    @Type(() => Number)
    ids_path: number[] = [];

}

export class GetMainCategoryDto {
  @ApiProperty({ description: "Nombre de la categoría principal" })
  name: string;
}


export class GetMainSubcategoryAttDto {
    @ApiProperty({ description: "ID de subcategoria" })
    id: number;

    @ApiProperty({ example: "ID de categoria principal"})
    category_id: number;

    @ApiProperty({ example: 'Descripcion de la subcategoria' })
    description: string;
}


export class ExitingMessageDto{
     @ApiProperty({description: "Mensaje de respuesta exitosa"})
     message: string;
}

export class GetSubCategoriesChildsDto{
    @ApiProperty({description: "ID de subcategoria"})
    @IsNumber()
    id_subcategory: number;

    @ApiProperty({description: "Descripcion del atributo"})
    @IsString()
    attribute: string;

    @ApiProperty({description: "Nivel"})
    @IsNumber()
    level: number;

    @ApiProperty({description: "Atributo padre"})
    @IsString()
    parent_attribute: string;

}