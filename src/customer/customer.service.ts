import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// Encrypt password
import * as bcrypt from "bcrypt"
import { CreateCustomerDto, CustomerAddressesDto, CustomerLoginDto, CustomerUpdateEmailDto, CustomerUpdatePersonalDataDto, ExitingAuthDto, GetCustomerDetailDto, GetCustomerDataDto, AuthCustomerDto, NewAddressDto, UpdateAddressDto } from './DTO/customer.dto';
import { CustomerExitingDto } from './DTO/exiting-message.dto';
import { PaginationDto } from 'src/user/DTO/pagination.dto';
import { JwtService } from '@nestjs/jwt';

// Dto

@Injectable()
export class CustomerService {
    constructor(private readonly prisma: PrismaService, private jwtService: JwtService) { }



    async login(dto: CustomerLoginDto): Promise<ExitingAuthDto> {
        const customer: AuthCustomerDto = await this.customerAuthentication(dto.email, dto.password);
        const payload: AuthCustomerDto = {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            last_name: customer.last_name,
            is_guest: customer.is_guest
        };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    async customerAuthentication(email: string, password: string): Promise<AuthCustomerDto> {
        const customer = await this.prisma.customers.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                name: true,
                last_name: true,
                email: true,
                is_guest: true,
                password: true
            }
        });

        if (!customer || !customer.password) {
            throw new UnauthorizedException("Correo o contraseña incorrectos")
        }

        const passwordMatch = await bcrypt.compare(password, customer.password);

        if (!passwordMatch) {
            throw new UnauthorizedException("Contraseña incorrecta");
        }

        const { password: _, ...saveUser } = customer;

        return saveUser
    }


    async create(dto: CreateCustomerDto): Promise<String> {

        const hashedPassword = await bcrypt.hash(dto.password, 15);

        await this.prisma.customers.create({
            data: {
                name: dto.name,
                last_name: dto.last_name,
                email: dto.email,
                contact_number: dto.contact_number,
                password: hashedPassword,
                is_guest: dto.is_guest
            }
        });

        return "Usuario creado";
    }

    async getAllCustomers(dto: PaginationDto): Promise<GetCustomerDataDto[]> {
        const page: number = dto.page;
        const limit: number = dto.limit;

        const skip: number = (page - 1) * limit;

        return await this.prisma.customers.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                last_name: true,
                email: true,
                is_guest: true
            }
        });
    }

    async getCustomer(id: number): Promise<GetCustomerDetailDto | null> {
        return await this.prisma.customers.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                last_name: true,
                email: true,
                contact_number: true,
                created_at: true,
                updated_at: true,
                is_guest: true,
                last_session: true,
            }
        })
    }

    async deleteUser(id: number): Promise<CustomerExitingDto> {
        const result = await this.prisma.customers.delete({
            where: {
                id
            }
        });

        return { message: `Cliente ${result.name} ${result.last_name} eliminado exitosamente.` }
    }

    // Protected services

    async updatePersonalData(id:number,dto: CustomerUpdatePersonalDataDto): Promise<String> {
        await this.prisma.customers.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        });

        return "Se actualizarón los datos personales exitosamente";
    }

    // Añadir auth en 2 pasos
    async updateEmail(id:number, dto: CustomerUpdateEmailDto): Promise<String> {
        await this.prisma.customers.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        });

        return "El correo electronico se actualizo exitosamente."
    }

    async newAddress(customer_id: number, dto: NewAddressDto): Promise<CustomerAddressesDto> {
        try {
            const result = await this.prisma.customerAddresses.create({
                data: {
                    customer_id,
                    ...dto
                }
            });

            return result;
        } catch (error) {
            throw new Error("Error al crear la dirección: " + error);
        }
    }

    async getAddresses(customer_id:number):Promise<CustomerAddressesDto[]>{
        try{
            const result = await this.prisma.customerAddresses.findMany({
                where:{
                    customer_id
                }
            });

            return result;
        }catch(error){
            throw new Error("Error al buscar las direcciones de envio");
        }
    }

    async updateAddress(customer_id:number,dto:UpdateAddressDto): Promise<CustomerAddressesDto | undefined>{
        try{
            const result = await this.prisma.customerAddresses.update({
                where:{
                    id: dto.id,
                    customer_id
                },
                data:{
                    ...dto
                }
            });

            return result;

        }catch(error){
            throw new BadRequestException("Error al actualizar la dirección del cliente ",error);
        }
    }

    async deleteAddress(customer_id:number,address_id:number):Promise<String>{
        try{
            await this.prisma.customerAddresses.delete({
                where:{
                    customer_id,
                    id: address_id
                }
            });
            return `Se elimino la dirección de envio satifactoriamente`;
        }catch(error){
            throw new BadRequestException("Error al eliminar la dirección de envio");
        }
    }
}
