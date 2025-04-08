import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ObjectId } from 'mongodb';
import { validate } from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserRepository } from './repository/user.repository';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const { name, email, password } = registerDto;
    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = new User();
    user.email = email;
    user.name = name;
    user.password = password;

    const errors = await validate(user);
    if (errors.length > 0) {
      const _errors = { email: 'Userinput is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.userRepository.save(user);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOneById(id: string): Promise<User> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }
}
