import { Controller, Get, Param, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';

// Nest Modules
import { Body, Post } from '@nestjs/common';

// Swagger
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

// DTO
import { CreateNewProductDto, ProductCreatedDto } from './DTO/product.dto';
import { AddProductImagesDto, AddProductSourcesDto } from './DTO/product-resources.dto';
import { SourceCreatedDto } from './DTO/source-created.dto';
import { AddProductToFavoritesDto, AddProductVersionDto, GetProductPerSubcategoryDto, ProductAddedToFavDto, ProductVerCardDto, ProductVerCardPlainDto, ProductVersionCreatedDto, ProductVersionDto } from './DTO/product-version.dto';


@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post('create')
    @ApiOperation({ summary: "Crear nuevo producto" })
    @ApiResponse({ status: 201, description: "Producto creado.", type: ProductCreatedDto })
    @ApiResponse({ status: 400, description: "Algo fallo al crear el producto." })
    @ApiResponse({ status: 500, description: "Error al crear el producto." })
    @ApiBody({ type: CreateNewProductDto })
    async createProduct(@Body() dto: CreateNewProductDto): Promise<ProductCreatedDto> {
        return this.productService.create(dto);
    }

    @Post('add-sources')
    @ApiOperation({ summary: "Añadir recursos a un producto" })
    @ApiResponse({ status: 201, description: "Recursos añadidos.", type: SourceCreatedDto })
    @ApiResponse({ status: 400, description: "Algo fallo al añadir los recursos." })
    @ApiResponse({ status: 500, description: "Error al añadir los recursos." })
    @ApiBody({ type: AddProductSourcesDto })
    // Validate all objects
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async addSources(@Body() dto: AddProductSourcesDto[]): Promise<SourceCreatedDto> {
        return this.productService.addProductSources(dto);
    }


    @Post('create-product-version')
    @ApiOperation({ summary: "Crear nueva version de un producto" })
    @ApiResponse({ status: 201, description: "Version de producto creada.", type: ProductVersionCreatedDto })
    @ApiResponse({ status: 400, description: "Algo fallo al añadir los recursos." })
    @ApiResponse({ status: 500, description: "Error al añadir los recursos." })
    @ApiBody({ type: AddProductVersionDto })
    async addProductVersion(@Body() dto: AddProductVersionDto): Promise<ProductVersionCreatedDto> {
        return this.productService.addProductVersion(dto);
    }

    @Post('add-product-version-imgs')
    @ApiOperation({ summary: "Añadir imagenes a una version de producto" })
    @ApiResponse({ status: 201, description: "Recursos añadidos.", type: SourceCreatedDto })
    @ApiResponse({ status: 400, description: "Algo fallo al añadir los recursos." })
    @ApiResponse({ status: 500, description: "Error al añadir los recursos." })
    @ApiBody({ type: AddProductImagesDto })
    // Validate all objects
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async addProductVersionImages(@Body() dto: AddProductImagesDto[]): Promise<SourceCreatedDto> {
        return this.productService.addProductVersionImgs(dto);
    }

    @Post("add-to-favorites/")
    @ApiOperation({ summary: "Añadir producto a favoritos (de un cliente existente)" })
    @ApiResponse({ status: 201, description: "Favorito agregado.", type: ProductAddedToFavDto })
    @ApiResponse({ status: 400, description: "Algo fallo al intentar agregar a favoritos este producto." })
    @ApiResponse({ status: 500, description: "Error al añadir a favoritos." })
    async addProductToFavorites(@Body() dto: AddProductToFavoritesDto): Promise<ProductAddedToFavDto> {
        return this.productService.addToFavorites(dto);
    }

    @Get("get-subcategory/")
    @ApiOperation({ summary: "Recuperar todas las tarjetas de producto por una ruta de subcategorias" })
    @ApiQuery({ name: 'category_id', required: true, type: Number, description: "ID de categoria de productos" })
    @ApiQuery({ name: 'path', required: true, type: Number, isArray: true, description: "Array de ID de subcategorias (relacionadas entre si)" })
    @ApiQuery({ name: 'offset', required: true, type: Number, description: "Tomar productos desde" })
    @ApiQuery({ name: 'limit', required: true, type: Number, description: "Limite de productos devueltos" })
    @ApiResponse({ status: 200, description: "Información recuperada.", type: ProductVerCardPlainDto, isArray: true })
    @ApiResponse({ status: 400, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 500, description: "Error al recuperar la información." })
    async getAllProductPerSubcategoryPath(@Query() query: GetProductPerSubcategoryDto):Promise<ProductVerCardPlainDto[]> {
        return this.productService.getCardsPerSubcategory(query);
    }

    @Get("get-ramdom/")
    @ApiOperation({ summary: "Recuperar todas las tarjetas de productos aletatoriamente" })
    @ApiQuery({ name: 'limit', required: true, type: Number, description: "Limite de registros" })
    @ApiResponse({ status: 200, description: "Información recuperada.", type: ProductVerCardPlainDto, isArray: true })
    @ApiResponse({ status: 400, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 500, description: "Error al recuperar la información." })
    async getCardsRamdom(@Query("limit",ParseIntPipe) limit:number): Promise<ProductVerCardPlainDto[] | null> {
        return this.productService.getCardsRamdom(limit);
    }

    @Get("get-detail/:sku")
    @ApiOperation({ summary: "Recuperar toda la información de un producto especifico" })
    @ApiParam({ name: "sku", type: Number, description: "sku del producto" })
    @ApiResponse({ status: 200, description: "Información recuperada.", type: ProductVersionDto })
    @ApiResponse({ status: 400, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 500, description: "Error al recuperar la información." })
    async getProductVersionDetail(@Param("sku", ParseIntPipe) sku: number): Promise<ProductVersionDto | null> {
        return this.productService.getProductVersionDetail(sku);
    }


    @Get("get-cards-per-main-category/:id")
    @ApiOperation({ summary: "Recuperar todas las tarjetas de producto por categoria" })
    @ApiParam({ name: "id", type: Number, description: "ID de subcategoria principal" })
    @ApiResponse({ status: 200, description: "Información recuperada.", type: ProductVerCardDto, isArray: true })
    @ApiResponse({ status: 400, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 500, description: "Error al recuperar la información." })
    async getAllProductCardsPerMainCategory(@Param("id", ParseIntPipe) id: number): Promise<ProductVerCardDto[] | null> {
        return this.productService.getProductCardsCustomerWithCategoryId(id);
    }


}
