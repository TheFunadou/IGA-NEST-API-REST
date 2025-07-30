import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';

// Prisma
import { PrismaService } from 'src/prisma/prisma.service';

// Encrypt passwords
import * as bcrypt from "bcrypt";
import { CreateUserDto, GetUsersByNameDto, GetUsersDto, UserCreatedDto, UserEliminatedDto, UserLogDto } from './DTO/user.dto';
import { PaginationDto } from './DTO/pagination.dto';

// DTO'S


@Injectable()
export class UserService {

    // Call to db
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateUserDto):Promise<UserCreatedDto> {

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                name: dto.name,
                last_name: dto.last_name,
                email: dto.email,
                is_superuser: dto.is_superuser,
                password: hashedPassword,
            }
        });

        const { password, ...safeUser } = user;
        return safeUser;
    }

    async newUserLog(data: UserLogDto):Promise<UserLogDto> {
        return await this.prisma.userLog.create({
            data: {
                description: data.description,
                user_id: data.user_id,
            }
        })
    }

    async getAllUsers(dto: PaginationDto):Promise<GetUsersDto[]> {
        const page: number = dto.page;
        const limit: number = dto.limit;

        const skip: number = (page - 1) * limit;

        return await this.prisma.user.findMany({
            skip: skip,
            take: limit,
            select: {
                id: true,
                username: true,
                name: true,
                last_name: true,
                email: true,
                created_at: true,
            }
        });
    }

    async getUserByName(dto: GetUsersByNameDto):Promise<GetUsersDto[]> {
        const page: number = dto.page;
        const limit: number = dto.limit;

        const skip: number = (page - 1) * limit;

        if (!dto.name_or_username || dto.name_or_username.length < 3) {
            console.log("Es menor a 3");
            throw new NotAcceptableException("El nombre debe tener mas de 2 caracteres");
        }

        return await this.prisma.$queryRaw<GetUsersDto[]>`
        SELECT * FROM get_user_by_name_or_username(${dto.name_or_username}::VARCHAR,${skip}::INT,${limit}::INT);
        `;
    }

    async getAllUserLogs(dto: PaginationDto):Promise<UserLogDto[]> {
        const page: number = dto.page;
        const limit: number = dto.limit;

        const skip: number = (page - 1) * limit;

        return await this.prisma.userLog.findMany({
            skip,
            take: limit
        });
    }

    async getUserLogs(user_id: number):Promise<UserLogDto | null> {
        return await this.prisma.userLog.findUnique({
            where: {
                id: user_id
            }
        });
    }

    async delete(id: number):Promise<UserEliminatedDto> {
        try {
            await this.prisma.user.delete({
                where: { id },
            });

            return {message:"Usuario eliminado"}
        } catch (error) {
            throw new NotFoundException(`Usuario con ID: ${id} no encontrado`)
        }
    }

}
