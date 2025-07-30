// Nest modules
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

// Services
import { CategoriesService } from './categories.service';

// Swagger
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto, DeleteCategoryAttDto, ExitingMessageDto, GetMainSubcategoryAttDto, GetSubCategoriesChildsDto, InsertCategoryAttDto } from './DTO/categories.dto';

// Dto

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post("create")
    @ApiOperation({ summary: "Crear nueva categoria" })
    @ApiResponse({ status: 201, description: "Categoria creada.", type: CreateCategoryDto})
    @ApiResponse({ status: 400, description: "Datos invalidos" })
    @ApiBody({ type:CreateCategoryDto })
    async createUser(@Body() createUserDto: CreateCategoryDto):Promise<CreateCategoryDto> {
        return this.categoriesService.create(createUserDto);
    }

    @Post("new-category-attribute")
    @ApiOperation({ summary: "Crear nueva subcategoria" })
    @ApiResponse({ status: 201, description: "Subcategoria creada.", type: ExitingMessageDto })
    @ApiResponse({ status: 400, description: "Hubo un error al crear la subcategoria" })
    @ApiResponse({ status: 500, description: "Error al crear la subcategoria" })
    @ApiBody({ type:InsertCategoryAttDto })
    async insertCategoryAtributte(@Body() dto: InsertCategoryAttDto): Promise<ExitingMessageDto> {
        return this.categoriesService.createCategoryAttribute(dto)
    }


    @Get("get-main-subcategories")
    @ApiOperation({ summary: "Obtener subcategorias principales" })
    @ApiResponse({ status: 200, description: "Datos recuperados.", type: GetMainSubcategoryAttDto , isArray: true})
    @ApiResponse({ status: 400, description: "Error al recuperar los datos de CategoryAttributes." })
    async getMainSubcategories(): Promise<GetMainSubcategoryAttDto[]> {
        return this.categoriesService.getMainSubCategoryAttributes();
    }

    @Get("get-subcategory-childrens/:id")
    @ApiOperation({ summary: "Obtener hijos de una subcategoria" })
    @ApiResponse({ status: 200, description: "Datos recuperados.", type: GetSubCategoriesChildsDto, isArray:true })
    @ApiResponse({ status: 404, description: "No se encontraron registros asociados al ID." })
    @ApiResponse({ status: 500, description: "Error al recuperar los datos de CategoryAttributes." })
    @ApiParam({ name: "id", type: Number, description: "id de la subcategoria" })
    async getChildrenSubcategories(@Param("id", ParseIntPipe) id: number):Promise<GetSubCategoriesChildsDto[]> {
        return this.categoriesService.getChildren(id);
    }


    @Delete("delete/:id")
    @ApiOperation({ summary: "Eliminar categoria" })
    @ApiResponse({ status: 200, description: "Categoria eliminada.", type: ExitingMessageDto })
    @ApiResponse({ status: 400, description: "Datos invalidos" })
    @ApiParam({ name: "id", type: Number, description: "id de la categoria" })
    async deleteMainCategory(@Param("id", ParseIntPipe) id: number): Promise<ExitingMessageDto> {
        return this.categoriesService.delete(id);
    }


    @Delete("delete-category-attribute/:id")
    @ApiOperation({ summary: "Eliminar subcategoria" })
    @ApiResponse({ status: 200, description: "Subcategoria eliminada.", type: ExitingMessageDto })
    @ApiResponse({ status: 400, description: "ID o ruta no validos" })
    @ApiResponse({ status: 500, description: "Error al eliminar la subcategoria" })
    @ApiParam({ name: "id", type: Number, description: "ID de Subcategoria objetivo" })
    @ApiBody({ type:DeleteCategoryAttDto })
    async deleteCategoryAttribute(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: DeleteCategoryAttDto
    ):Promise<ExitingMessageDto> {
        return this.categoriesService.deleteCategoryAttribute(id, dto);
    }

}
