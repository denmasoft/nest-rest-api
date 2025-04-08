import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() registerDto: RegisterDto) {
    return this.userService.create(registerDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
