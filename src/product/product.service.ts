import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// DTO
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { CreateNewProductDto, ProductCreatedDto } from './DTO/product.dto';
import { AddProductImagesDto, AddProductSourcesDto } from './DTO/product-resources.dto';
import { SourceCreatedDto } from './DTO/source-created.dto';
import { AddProductToFavoritesDto, AddProductVersionDto, GetProductPerSubcategoryDto, ProductAddedToFavDto, ProductVerCardDto, ProductVerCardPlainDto, ProductVersionCreatedDto, ProductVersionDto } from './DTO/product-version.dto';



@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateNewProductDto): Promise<ProductCreatedDto> {
        try {
            const { attributes, ...cleanDto } = dto;

            // Transaction
            return await this.prisma.$transaction(async (tx) => {
                // Create product
                const product = await tx.product.create({
                    data: {
                        ...cleanDto,
                    },
                });

                // add productAttributes to new product object
                const attributeData = attributes.map((id) => ({
                    product_id: product.id,
                    category_attribute_id: id
                }));

                await tx.productAttributes.createMany({
                    data: attributeData,
                    skipDuplicates: true,
                });

                return product
            });

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code == "P2003") {
                throw new BadRequestException("Existe una violacion a alguna de las llaves foraneas category_id, user_id");
            }
            throw error;
        }
    }

    async addProductSources(dto: AddProductSourcesDto[]): Promise<SourceCreatedDto> {
        try {
            await this.prisma.productSources.createMany({
                data: dto,
            });

            return { message: "Recursos añadidos exitosamente" }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code == "P2003") {
                throw new BadRequestException("Existe una violacion a la llave foranea product_id");
            }
            throw error;
        }
    }

    async addProductVersion(dto: AddProductVersionDto): Promise<ProductVersionCreatedDto> {
        try {
            // Get the values in ProductAttributes
            const attributes = await this.getAttributesValues(dto.product_id);
            return await this.prisma.productVersion.create({
                data: {
                    product_id: dto.product_id,
                    sku: dto.sku,
                    code_bar: dto.code_bar,
                    attributes: attributes.map((att) => att.category_attribute.description),
                    color_line: dto.color_line,
                    color_name: dto.color_name,
                    color_code: dto.color_code,
                    status: dto.status,
                    stock: dto.stock,
                    unit_price: dto.unit_price,
                    main_version: dto.main_version
                }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        throw new BadRequestException("Existe una violacion en los campos sku o code_bar, deben ser unicos.");

                    case 'P2003':
                        throw new BadRequestException("Existe una violacion a la llave foranea product_id");
                }
            }
            throw error;
        }
    }

    async getAttributesValues(product_id: number) {
        // Serch in productAttributes
        return await this.prisma.productAttributes.findMany({
            where: {
                product_id
            },
            select: {
                category_attribute: {
                    select: {
                        description: true
                    }
                }
            }
        });
    }

    async addProductVersionImgs(dto: AddProductImagesDto[]): Promise<SourceCreatedDto> {
        // const sku_or_code_bar = dto[0].sku_or_code_bar;
        try {
            await this.prisma.productImage.createMany({
                data: dto,
            });
            return { message: "Recursos añadidos exitosamente" }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2003':
                        throw new BadRequestException("Existe una violacion a la llave foranea product_id");
                }
            }
            throw error;
        }
    }

    async addToFavorites(dto: AddProductToFavoritesDto): Promise<ProductAddedToFavDto> {
        return await this.prisma.customerFavorites.create({
            data: {
                ...dto
            },
        });
    }

    async getProductCardsPerSubcategory(dto: GetProductPerSubcategoryDto): Promise<ProductVerCardPlainDto[]> {
        if (!Array.isArray(dto.path)) {
            // Is not array 
            const path: number[] = [dto.path];
            return await this.prisma.$queryRaw<ProductVerCardPlainDto[]>`
            -- View ../postgres/IGA-API-REST-POSTGRES-FUNCTIONS-SCIRPT.sql
            SELECT * FROM get_product_versions_by_path(
                ${dto.category_id}::INT,
                ${path}::INT[]
            )
            `;
        }

        return await this.prisma.$queryRaw<ProductVerCardPlainDto[]>`
        -- View ../postgres/IGA-API-REST-POSTGRES-FUNCTIONS-SCIRPT.sql
        SELECT * FROM get_product_versions_by_path(
            ${dto.category_id}::INT,
            ${dto.path}::INT[]
        )
        `;
    }

    async getProductVersionDetail(sku: number): Promise<ProductVersionDto | null> {
        return await this.prisma.productVersion.findFirst({
            where: { sku },
            select: {
                product_id: true,
                sku: true,
                attributes: true,
                unit_price: true,
                product_images: {
                    where: { main_image: true },
                    select: {
                        image_url: true,
                        main_image: true
                    }
                },
                product: {
                    select: {
                        product_name: true,
                        specs: true,
                        recomendations: true,
                        applications: true,
                        certifications_desc: true,
                        category: {
                            select: { name: true }
                        },
                        product_sources: {
                            select: {
                                source_description: true,
                                source_url: true
                            }
                        }
                    }
                }
            }
        });

    }

    async getProductCardsCustomerWithCategoryId(id: number): Promise<ProductVerCardDto[] | null> {
        return await this.prisma.productVersion.findMany({
            where: {
                product: {
                    category_id: id
                }
            },
            select: {
                product_id: true,
                sku: true,
                attributes: true,
                unit_price: true,
                product_images: {
                    where: { main_image: true },
                    select: {
                        image_url: true,
                        main_image: true
                    }
                },
                product: {
                    select: {
                        product_name: true,
                    }
                }
            }
        });
    }


}


