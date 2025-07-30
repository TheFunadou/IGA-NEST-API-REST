import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[AuthModule, PrismaModule],
  controllers:[CustomerController],
  providers: [CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {}
