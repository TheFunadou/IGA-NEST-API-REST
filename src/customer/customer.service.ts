import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// Encrypt password
import * as bcrypt from "bcrypt"
import { CreateCustomerDto, CustomerCreatedDto, CustomerLoginDto, CustomerUpdateEmailDto, CustomerUpdatePersonalDataDto, ExitingAuthDto, GetCustomerDetailDto, GetCustomerDto } from './DTO/customer.dto';
import { CustomerExitingDto } from './DTO/exiting-message.dto';
import { PaginationDto } from 'src/user/DTO/pagination.dto';
import { JwtService } from '@nestjs/jwt';

// Dto

@Injectable()
export class CustomerService {
    constructor(private readonly prisma:PrismaService, private jwtService: JwtService){}

    async login(dto: CustomerLoginDto): Promise<ExitingAuthDto>{
        const customer = await this.customerAuthentication(dto.email,dto.password);
        const payload = {sub: customer.id, email: customer.email};

        return {
            access_token: this.jwtService.sign(payload),
            customer: {
                ...customer
            }
        };
    }

    async customerAuthentication(email:string,password:string):Promise<GetCustomerDto>{
        const customer = await this.prisma.customers.findUnique({
            where:{
                email
            },
            select:{
                id: true,
                name:true,
                last_name:true,
                email: true,
                is_guest: true,
                password: true
            }
        });

        if (!customer || !customer.password){
            throw new UnauthorizedException("Correo o contraseña incorrectos")
        }

        const passwordMatch = await bcrypt.compare(password, customer.password);

        if(!passwordMatch){
            throw new UnauthorizedException("Contraseña incorrecta");
        }

        const {password:_, ...saveUser} = customer;

        return saveUser
    }


    async create(dto:CreateCustomerDto):Promise<CustomerCreatedDto>{

        const hashedPassword = await bcrypt.hash(dto.password,15);

        const result = await this.prisma.customers.create({
            data:{
                name: dto.name,
                last_name: dto.last_name,
                email: dto.email,
                contact_number: dto.contact_number,
                password: hashedPassword,
                is_guest: dto.is_guest
            }
        });

        const {password,last_session,updated_at,...saveCustomer} = result;

        return saveCustomer;
    }

    async getAllCustomers(dto:PaginationDto):Promise<GetCustomerDto[]>{
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

    async getCustomer(id:number): Promise<GetCustomerDetailDto | null>{
        return await this.prisma.customers.findUnique({
            where:{id},
            select:{
                id:true,
                name:true,
                last_name:true,
                email:true,
                contact_number: true,
                created_at: true,
                updated_at:true,
                is_guest:true,
                last_session: true,
            }
        })
    }

    async updatePersonalData(dto:CustomerUpdatePersonalDataDto):Promise<CustomerUpdatePersonalDataDto>{
        const result = await this.prisma.customers.update({
            where:{
                id: dto.id,
            },
            data:{
                ...dto
            }
        });

        const {created_at,updated_at,password,is_guest,last_session,...userUpdated} = result;

        return userUpdated;
    }

    // Añadir auth en 2 pasos
    async updateEmail(dto:CustomerUpdateEmailDto):Promise<CustomerExitingDto>{
        await this.prisma.customers.update({
            where:{
                id: dto.id
            },
            data:{
                ...dto
            }
        });

        return {message: "El correo electronico se actualizo exitosamente."}
    }

    async deleteUser(id:number):Promise<CustomerExitingDto>{
        const result = await this.prisma.customers.delete({
            where:{
                id
            }
        });

        return {message: `Cliente ${result.name} ${result.last_name} eliminado exitosamente.`}
    }
}
