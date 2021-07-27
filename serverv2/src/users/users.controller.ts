import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { Response } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateDto, @Res() res: Response) {
        const result = await this.usersService.create(createUserDto);
        res.status(HttpStatus.CREATED).send(result);
    }
}
