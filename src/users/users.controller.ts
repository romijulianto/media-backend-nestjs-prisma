import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import {
  ApiResponse,
  ApiResponseCustomMessage,
} from 'src/common/dto/api-response.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Post users', description: 'Post new user' })
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Return all users',
  })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(): Promise<ApiResponse<any>> {
    try {
      const data = await this.usersService.findAll();
      return new ApiResponse(HttpStatus.OK, 'success', data);
    } catch (error) {
      return new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an user by ID',
    description: 'Return a specific user by ID',
  })
  @ApiOkResponse({ type: UserEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<any>> {
    try {
      const data = await this.usersService.findOne(id);
      if (!data) {
        throw new NotFoundException(
          `${ApiResponseCustomMessage.USERS_NOT_FOUND} ${id}`,
        ).getResponse();
      }
      return new ApiResponse(HttpStatus.OK, 'success', data);
    } catch (error) {
      throw new NotFoundException(
        `${ApiResponseCustomMessage.USERS_NOT_FOUND} ${id}`,
      ).getResponse();
    }
    return;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Patch an user by ID',
    description: 'Return update user by ID',
  })
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<any>> {
    try {
      const data = await this.usersService.update(id, updateUserDto);
      if (!data) {
        throw new NotFoundException(
          `${ApiResponseCustomMessage.USERS_NOT_FOUND} ${id}`,
        ).getResponse();
      }
      return new ApiResponse(
        HttpStatus.OK,
        `${ApiResponseCustomMessage.USERS_UPDATE} ${id}`,
        data,
      );
    } catch (error) {
      throw new NotFoundException(
        `${ApiResponseCustomMessage.USERS_NOT_FOUND} ${id}`,
      ).getResponse();
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an user by ID',
    description: 'Return delete user by ID',
  })
  @ApiOkResponse({ type: UserEntity })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<any>> {
    try {
      const data = await this.usersService.remove(id);
      if (!data) {
        throw new NotFoundException(
          `${ApiResponseCustomMessage.USERS_NOT_FOUND} ${id}`,
        ).getResponse();
      }
      return new ApiResponse(
        HttpStatus.OK,
        `${ApiResponseCustomMessage.USERS_DELETE} ${id}`,
      );
    } catch (error) {
      throw new NotFoundException(
        `${ApiResponseCustomMessage.USERS_NOT_FOUND} ${id}`,
      ).getResponse();
    }
  }
}
