import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

// Input Dto

// Output dto
import { CreateCustomerDto, CustomerAddressesDto, CustomerLoginDto, CustomerRequestDto, CustomerUpdateEmailDto, CustomerUpdatePersonalDataDto, ExitingAuthDto, GetCustomerDetailDto, NewAddressDto, GetCustomerDataDto, UpdateAddressDto, AuthCustomerDto } from './DTO/customer.dto';
import { CustomerExitingDto } from './DTO/exiting-message.dto';
import { PaginationDto } from 'src/user/DTO/pagination.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// Import RES

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Post("login")
    @ApiOperation({ summary: "Login de clientes" })
    @ApiResponse({ status: 201, description: "Cliente autenticado exitosamente.", type: ExitingAuthDto })
    @ApiResponse({ status: 400, description: "Algo fallo al autenticar el cliente." })
    @ApiResponse({ status: 401, description: "Credenciales incorrectas, no autorizado." })
    @ApiResponse({ status: 500, description: "Error al autenticar el cliente." })
    async customerLogin(
        @Body() dto: CustomerLoginDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<String> {
        const { access_token } = await this.customerService.login(dto);

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        return "Autenticación exitosa";
    }

    @Post("logout")
    @ApiOperation({ summary: "Cerrar sesión de un  cliente" })
    @ApiResponse({ status: 201, description: "Cierre de sesión exitoso." })
    @ApiResponse({ status: 400, description: "Algo fallo al cerrar sesión." })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @ApiResponse({ status: 500, description: "Error al cerrar sesión." })
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return { message: "Logout exitoso" };
    }

    @Post('create')
    @ApiOperation({ summary: "Crear nuevo cliente" })
    @ApiResponse({ status: 201, description: "Cliente creado.", type: String, example: "Usuario creado" })
    @ApiResponse({ status: 400, description: "Algo fallo al crear el cliente." })
    @ApiResponse({ status: 500, description: "Error al crear el cliente." })
    @ApiBody({ type: CreateCustomerDto })
    async createProduct(@Body() dto: CreateCustomerDto): Promise<String> {
        return this.customerService.create(dto);
    }

    @Get("get-all")
    @ApiOperation({ summary: "Obtener a todos los clientes" })
    @ApiResponse({ status: 200, description: "Información obtenida.", type: GetCustomerDataDto, isArray: true })
    @ApiResponse({ status: 400, description: "Algo fallo al obtener la información de los clientes." })
    @ApiResponse({ status: 500, description: "Error al obtener la información de los clientes." })
    @ApiQuery({ name: 'page', required: true, type: Number })
    @ApiQuery({ name: 'limit', required: true, type: Number })
    async getAllCustomers(@Query() query: PaginationDto): Promise<GetCustomerDataDto[]> {
        return this.customerService.getAllCustomers(query)
    }

    @Get("get/:id")
    @ApiOperation({ summary: "Obtener la información de un usuario" })
    @ApiResponse({ status: 200, description: "Información obtenida.", type: GetCustomerDataDto })
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

    // Protected endpoints
    @Get("profile")
    @ApiOperation({ summary: "Obtener el perfil del cliente autenticado" })
    @ApiResponse({ status: 201, description: "Perfil de cliente recuperado exitosamente.", type: AuthCustomerDto })
    @ApiResponse({ status: 400, description: "Algo fallo al recuperar el perfil del cliente." })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @ApiResponse({ status: 500, description: "Error al recuperar el perfil del cliente." })
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req: CustomerRequestDto): Promise<AuthCustomerDto> {
        return req.user;
    }


    @Post("new-address")
    @ApiOperation({ summary: "Agregar nueva dirección de envio" })
    @ApiResponse({ status: 201, description: "Dirección de envio creada.", type: NewAddressDto })
    @ApiResponse({ status: 400, description: "Algo fallo al crear la nueva dirección de envio en el perfil del cliente." })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @ApiResponse({ status: 500, description: "Error al crear la nueva dirección de envio en el perfil del cliente." })
    @UseGuards(JwtAuthGuard)
    async newAddress(@Request() req: CustomerRequestDto, @Body() dto: NewAddressDto): Promise<CustomerAddressesDto> {
        return this.customerService.newAddress(req.user.id, dto);
    }

    @Get("get-addresses")
    @ApiOperation({ summary: "Obtener las direcciones de envio de un perfil" })
    @ApiResponse({ status: 200, description: "Direcciones de envio recuperadas.", type: CustomerAddressesDto, isArray:true })
    @ApiResponse({ status: 400, description: "Algo fallo al recuperar las direcciones de envio en el perfil del cliente." })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @ApiResponse({ status: 500, description: "Error al recuperar las direcciones de envio en el perfil del cliente." })
    @UseGuards(JwtAuthGuard)
    async getAddresses(@Request() req: CustomerRequestDto): Promise<CustomerAddressesDto[]> {
        return this.customerService.getAddresses(req.user.id);
    }

    @Put('update-address')
    @ApiOperation({ summary: "Actualizar dirección de envio del cliente" })
    @ApiResponse({ status: 201, description: "Dirección de envio actualizada.", type: String })
    @ApiResponse({ status: 400, description: "Algo fallo al actualizar la dirección de envio del cliente." })
    @ApiResponse({ status: 500, description: "Error al actualizar la dirección de envio del cliente." })
    @ApiBody({ type: CustomerUpdatePersonalDataDto })
    @UseGuards(JwtAuthGuard)
    async editAddress(@Request() req: CustomerRequestDto, @Body() dto: UpdateAddressDto): Promise<CustomerAddressesDto | undefined> {
        return this.customerService.updateAddress(req.user.id, dto);
    }

    @Put('update-personal-data')
    @ApiOperation({ summary: "Actualizar información del cliente" })
    @ApiResponse({ status: 201, description: "Cliente actualizado.", type: String })
    @ApiResponse({ status: 400, description: "Algo fallo al actualizar el cliente." })
    @ApiResponse({ status: 500, description: "Error al actualizar el cliente." })
    @ApiBody({ type: CustomerUpdatePersonalDataDto })
    @UseGuards(JwtAuthGuard)
    async editPersonalData(@Request() req: CustomerRequestDto, @Body() dto: CustomerUpdatePersonalDataDto): Promise<String> {
        return this.customerService.updatePersonalData(req.user.id, dto);
    }

    @Put('update-email')
    @ApiOperation({ summary: "Actualizar información del cliente" })
    @ApiResponse({ status: 201, description: "Cliente actualizado.", type: String })
    @ApiResponse({ status: 400, description: "Algo fallo al actualizar el cliente." })
    @ApiResponse({ status: 500, description: "Error al actualizar el cliente." })
    @ApiBody({ type: CustomerUpdateEmailDto })
    @UseGuards(JwtAuthGuard)
    async editEmail(@Request() req: CustomerRequestDto, @Body() dto: CustomerUpdateEmailDto): Promise<String> {
        return this.customerService.updateEmail(req.user.id, dto);
    }

    @Delete("delete-address/:id")
    @ApiOperation({ summary: "Eliminar una dirección de envio del cliente" })
    @ApiResponse({ status: 200, description: "Dirección de envio eliminada.", type: String })
    @ApiResponse({ status: 400, description: "Algo fallo al eliminar la dirección de envio." })
    @ApiResponse({ status: 500, description: "Error al eliminar la dirección de envio el cliente." })
    @UseGuards(JwtAuthGuard)
    async deleteAddress(@Request() req: CustomerRequestDto, @Param("id",ParseIntPipe) address_id:number){
        return this.customerService.deleteAddress(req.user.id, address_id);
    }

}
