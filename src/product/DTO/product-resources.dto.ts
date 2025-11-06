import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";


export class AddProductSourcesDto {
  @ApiProperty({ example: 5 })
  @IsNotEmpty({ message: "The product_id field cannot be empty" })
  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @ApiProperty({ example: "ficha tecnica" })
  @IsNotEmpty({ message: "The source_description field cannot be empty" })
  source_description: string;

  @ApiProperty({ example: "https://igaproductos.com.mx/wp-content/uploads/2024/07/FICHA_HIT_INTERVALO_ROJO_G.jpg" })
  @IsNotEmpty({ message: "The source_url field cannot be empty" })
  source_url: string;
}

export class GetProductSourcesDto {
  @ApiProperty({ description: "Descripción del recurso" })
  source_description: string;

  @ApiProperty({ description: "URL del recurso" })
  source_url: string;
}



export class AddProductImagesDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: "The id field cannot be empty" })
  product_version_id: number;

  @ApiProperty({ example: "https://igaproductos.com.mx/wp-content/uploads/2024/07/Amarillo_003.jpg" })
  @IsNotEmpty({ message: "The image_url field cannot be empty" })
  image_url: string;

  @ApiProperty({ example: true })
  @IsNotEmpty({ message: "the main_image filed cannot be empty" })
  main_image: boolean;

}

export class GetProductImagesDto {

  @ApiProperty({ description: "URL de la imagen del producto" })
  id: number;

  @ApiProperty({ description: "URL de la imagen del producto" })
  image_url: string;

  @ApiProperty({ description: "¿Es la imagen principal?" })
  main_image: boolean;
}

export class ProductImagesSmallDto{
  @ApiProperty({ description: "URL de la imagen del producto" })
  image_url: string;
}

