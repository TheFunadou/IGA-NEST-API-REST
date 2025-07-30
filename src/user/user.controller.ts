import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, GetUsersByNameDto, GetUsersDto, UserCreatedDto, UserEliminatedDto, UserLogDto } from './DTO/user.dto';
import { PaginationDto } from './DTO/pagination.dto';



@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('create')
    @ApiOperation({ summary: "Crear nuevo usuario" })
    @ApiResponse({ status: 201, description: "Usuario creado.", type: UserCreatedDto })
    @ApiResponse({ status: 400, description: "Datos invalidos" })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserCreatedDto> {
        return this.userService.create(createUserDto);
    }


    @Post("new-log/")
    @ApiOperation({ summary: "Crear nuevo registro de usuario" })
    @ApiResponse({ status: 200, description: "registro creado.", type: UserLogDto })
    @ApiResponse({ status: 404, description: "Usuario no encontrado." })
    async newUserLogRecord(@Body() newUserLog: UserLogDto):Promise<UserLogDto> {
        return this.userService.newUserLog(newUserLog);
    }

    @Get("get-all")
    @ApiOperation({ summary: "Obtener los usuarios" })
    @ApiResponse({ status: 200, description: "Información recuperada", type: GetUsersDto, isArray:true })
    @ApiResponse({ status: 400, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 500, description: "Error al recuperar la información." })
    @ApiQuery({ name: 'page', required: true, type: Number })
    @ApiQuery({ name: 'limit', required: true, type: Number })
    async getAllUsers(@Query() query: PaginationDto):Promise<GetUsersDto[]> {
        return this.userService.getAllUsers(query);
    }

    @Get("search-logs-by-name")
    @ApiOperation({ summary: "Obtener usuarios por nombre (parcial o completo)" })
    @ApiResponse({ status: 200, description: "Información recuperada.", type: GetUsersDto, isArray:true })
    @ApiResponse({ status: 400, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 406, description: "Parametros no aceptados." })
    @ApiResponse({ status: 500, description: "Error al recuperar la información." })
    @ApiQuery({ name: 'name_or_username', required: true, type: String })
    @ApiQuery({ name: 'page', required: true, type: Number })
    @ApiQuery({ name: 'limit', required: true, type: Number })
    async getUserByName(@Query() query: GetUsersByNameDto):Promise<GetUsersDto[]> {
        return this.userService.getUserByName(query);
    }

    @Get("get-all-logs")
    @ApiOperation({ summary: "Obtener logs" })
    @ApiResponse({ status: 200, description: "Información recuperada.", type:UserLogDto, isArray:true })
    @ApiResponse({ status: 400, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 406, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 500, description: "Error al recuperar la información." })
    @ApiQuery({ name: 'page', required: true, type: Number })
    @ApiQuery({ name: 'limit', required: true, type: Number })
    async getAllUserLogs(@Query() query: PaginationDto):Promise<UserLogDto[]> {
        return this.userService.getAllUserLogs(query);
    }


    @Get("get-logs/:id")
    @ApiOperation({ summary: "Obtener logs de un usuario" })
    @ApiResponse({ status: 200, description: "Información recuperada.", type: UserLogDto })
    @ApiResponse({ status: 400, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 406, description: "Algo fallo al intentar recuperar la información." })
    @ApiResponse({ status: 500, description: "Error al recuperar la información." })
    @ApiParam({ name: "id", type: Number, description: "id del usuario" })
    async getUserLogs(@Param("id", ParseIntPipe) id: number): Promise<UserLogDto | null> {
        return this.userService.getUserLogs(id);
    }


    @Delete("delete/:id")
    @ApiOperation({ summary: "Eliminar usuario" })
    @ApiParam({ name: "id", type: Number, description: "id de usuario" })
    @ApiResponse({ status: 200, description: "Usuario eliminado.", type: UserEliminatedDto })
    @ApiResponse({ status: 404, description: "Usuario no encontrado." })
    @ApiParam({ name: "id", type: Number, description: "id del usuario" })
    async deleteUser(@Param("id", ParseIntPipe) id: number):Promise<UserEliminatedDto> {
        return this.userService.delete(id);
    }

}
