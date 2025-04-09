import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PassportAuthGuard } from 'src/auth/guards/passport/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() registerDto: RegisterDto) {
    return this.userService.create(registerDto);
  }

  @UseGuards(PassportAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
