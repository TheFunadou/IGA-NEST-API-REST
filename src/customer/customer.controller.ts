import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

// Input Dto

// Output dto
import { CreateCustomerDto, CustomerCreatedDto, CustomerLoginDto, CustomerUpdateEmailDto, CustomerUpdatePersonalDataDto, ExitingAuthDto, GetCustomerDetailDto, GetCustomerDto } from './DTO/customer.dto';
import { CustomerExitingDto } from './DTO/exiting-message.dto';
import { PaginationDto } from 'src/user/DTO/pagination.dto';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Post("login")
    @ApiOperation({ summary: "Login de clientes" })
    @ApiResponse({ status: 201, description: "Cliente autenticado exitosamente."})
    @ApiResponse({ status: 400, description: "Algo fallo al autenticar el cliente." })
    @ApiResponse({ status: 401, description: "Credenciales incorrectas, no autorizado." })
    @ApiResponse({ status: 500, description: "Error al autenticar el cliente el cliente." })
    async customerLogin(@Body() dto:CustomerLoginDto):Promise<ExitingAuthDto>{
        return this.customerService.login(dto);
    }

    @Post('create')
    @ApiOperation({ summary: "Crear nuevo cliente" })
    @ApiResponse({ status: 201, description: "Cliente creado.", type: CustomerCreatedDto })
    @ApiResponse({ status: 400, description: "Algo fallo al crear el cliente." })
    @ApiResponse({ status: 500, description: "Error al crear el cliente." })
    @ApiBody({ type: CreateCustomerDto })
    async createProduct(@Body() dto: CreateCustomerDto): Promise<CustomerCreatedDto> {
        return this.customerService.create(dto);
    }

    @Put('update-personal-data')
    @ApiOperation({ summary: "Actualizar información del cliente" })
    @ApiResponse({ status: 201, description: "Cliente actualizado.", type: CustomerUpdatePersonalDataDto })
    @ApiResponse({ status: 400, description: "Algo fallo al actualizar el cliente." })
    @ApiResponse({ status: 500, description: "Error al actualizar el cliente." })
    @ApiBody({ type: CustomerUpdatePersonalDataDto })
    async editPersonalData(@Body() dto: CustomerUpdatePersonalDataDto): Promise<CustomerUpdatePersonalDataDto> {
        return this.customerService.updatePersonalData(dto);
    }

    @Put('update-email')
    @ApiOperation({ summary: "Actualizar información del cliente" })
    @ApiResponse({ status: 201, description: "Cliente actualizado.", type: CustomerExitingDto })
    @ApiResponse({ status: 400, description: "Algo fallo al actualizar el cliente." })
    @ApiResponse({ status: 500, description: "Error al actualizar el cliente." })
    @ApiBody({ type: CustomerUpdateEmailDto })
    async editEmail(@Body() dto: CustomerUpdateEmailDto): Promise<CustomerExitingDto> {
        return this.customerService.updateEmail(dto);
    }


    @Get("get-all")
    @ApiOperation({ summary: "Obtener a todos los clientes" })
    @ApiResponse({ status: 200, description: "Información obtenida.", type: GetCustomerDto, isArray: true })
    @ApiResponse({ status: 400, description: "Algo fallo al obtener la información de los clientes." })
    @ApiResponse({ status: 500, description: "Error al obtener la información de los clientes." })
    @ApiQuery({ name: 'page', required: true, type: Number })
    @ApiQuery({ name: 'limit', required: true, type: Number })
    async getAllCustomers(@Query() query: PaginationDto): Promise<GetCustomerDto[]> {
        return this.customerService.getAllCustomers(query)
    }

    @Get("get/:id")
    @ApiOperation({ summary: "Obtener la información de un usuario" })
    @ApiResponse({ status: 200, description: "Información obtenida.", type: CustomerCreatedDto })
    @ApiResponse({ status: 400, description: "Algo fallo al obtener la información del cliente." })
    @ApiResponse({ status: 500, description: "Error al obtener la información del cliente." })
    async getCustomer(@Param("id", ParseIntPipe) id: number): Promise<GetCustomerDetailDto | null> {
        return this.customerService.getCustomer(id)
    }

    @Delete("delete/:id")
    @ApiOperation({ summary: "Eliminar a un cliente" })
    @ApiResponse({ status: 200, description: "Cliente eliminado.", type: CustomerExitingDto })
    @ApiResponse({ status: 400, description: "Algo fallo al eliminar el cliente." })
    @ApiResponse({ status: 500, description: "Error al eliminar el cliente." })
    @ApiParam({ name: "id", description: "ID del usuario" })
    async deleteCustomer(@Param("id", ParseIntPipe) id: number): Promise<CustomerExitingDto> {
        return this.customerService.deleteUser(id);
    }
}
