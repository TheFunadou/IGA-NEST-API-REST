import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { CreateCategoryDto, DeleteCategoryAttDto, ExitingMessageDto, GetMainSubcategoryAttDto, GetSubCategoriesChildsDto, InsertCategoryAttDto } from './DTO/categories.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    // Create new record in Category
    async create(dto: CreateCategoryDto): Promise<CreateCategoryDto> {
        return await this.prisma.category.create({
            data: {
                ...dto
            },
        });
    }

    // Create record in CategoryAttribute
    async createCategoryAttribute(insertCategoryAttDto: InsertCategoryAttDto): Promise<ExitingMessageDto> {
        try {
            // Convert to instance the form
            const dto = plainToInstance(InsertCategoryAttDto, insertCategoryAttDto)

            // Validate the dto
            await validateOrReject(dto)

            // Use query raw for call the insert_category_attribute function in postgres
            // Check the PostgresFunctionsScript.sql
            await this.prisma.$queryRaw`
            SELECT insert_category_attribute(
                ${dto.category_id}::INT,
                ${dto.description}::TEXT,
                ${dto.ids_path}::INT[]
            );
            `;
            return { message: `Se inserto la subcategoria ${insertCategoryAttDto.description} exitosamente.` };

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // 🔍 Puedes manejar errores por código SQL
                const postgresCode = error.meta?.code;

                switch (postgresCode) {
                    case '42703': // columna no existe
                        throw new BadRequestException('Error en la consulta: columna no encontrada.');

                    case '42883': // función no existe o tipos no coinciden
                        throw new BadRequestException('La función no fue encontrada o los tipos son incorrectos.');

                    case '23505': // clave duplicada
                        throw new BadRequestException('Ya existe un registro con esos datos.');

                    default:
                        console.error('Error conocido de Prisma:', error);
                        throw new InternalServerErrorException('Error en base de datos (Prisma)');
                }

            } else {
                // Otro tipo de error (de red, parsing, etc.)
                console.error('Error inesperado:', error);
                throw new InternalServerErrorException('Ocurrió un error inesperado');
            }
        }

    }

    async getMainSubCategoryAttributes(): Promise<GetMainSubcategoryAttDto[]> {
        return await this.prisma.categoryAttributes.findMany({
            where: {
                level: 0
            },
            select: {
                id: true,
                category_id: true,
                description: true,
            },
        });
    }

    async getChildren(id: number): Promise<GetSubCategoriesChildsDto[]> {
        const response = await this.prisma.$queryRaw<GetSubCategoriesChildsDto[]>`SELECT * FROM get_children_from_father(${id}::int)`;
        if (response.length === 0) {
            throw new NotFoundException(`No se encontro ningun registro asociado al id ${id}`);
        }
        return response;
    }

    // Delete record in Category
    async delete(id: number): Promise<ExitingMessageDto> {
        const result = await this.prisma.category.delete({
            where: {
                id
            }
        });

        return { message: `${result.name} eliminado exitosamente` };
    }


    async deleteCategoryAttribute(id: number, dto: DeleteCategoryAttDto): Promise<ExitingMessageDto> {
        try {
            if (dto.path.length > 0) {
                await this.prisma.$executeRaw`
                SELECT delete_category_attribute(
                    ${id}::INT,
                    ${dto.path}::INT[]
                )
                `;
                return { message: "Subcategoria eliminada exitosamente" };
            } else {
                await this.prisma.$executeRaw`
                SELECT delete_category_attribute(
                    ${id}::INT
                )
                `;
                return { message: "Subcategoria eliminada exitosamente" };

            }

        } catch (error) {
            const msg = typeof error.message === 'string' ? error.message : '';

            // Subcategory with children
            if (msg.includes('No se puede eliminar una subcategoría con hijos existentes')) {
                throw new BadRequestException(msg);
            }

            // Unknown path or ID
            if (msg.includes('no se encontró el nodo') || msg.includes('no es raíz') || msg.includes('no existe')) {
                throw new NotFoundException(msg);
            }

            console.error('[deleteCategoryAttribute error]', error);
            throw new InternalServerErrorException('Error al eliminar la subcategoría.');
        }
    }


}


