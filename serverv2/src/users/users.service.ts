import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }

    async create(createDto: CreateUserDto): Promise<{_id: string, name: string, email: string}> {

        const exisitingUser = await this.userModel.findOne({ email: createDto.email });

        if (exisitingUser) {
            throw new HttpException('User alreay exists!', HttpStatus.BAD_REQUEST);
        }

        if (createDto.password !== createDto.confirmPassword) {
            throw new HttpException('Password mismatched.', HttpStatus.BAD_REQUEST);
        }


        const hashedPassword = await bcrypt.hash(createDto.password, 12);

        try {
            const createdUser = new this.userModel({
                email: createDto.email,
                password: hashedPassword,
                name: `${createDto.firstName} ${createDto.lastName}`
            });
            const user = await createdUser.save();
            delete user.password;
            return {_id: user._id, name: user.name, email: user.email};
        } catch (error) {
            throw new HttpException('Error creating User', HttpStatus.BAD_REQUEST);
        }
    }

    async findByEmail(email: string, isLogin?: boolean) {
        if (isLogin) {
            return await this.userModel.findOne({ email: email }).select('+password')
        }
        return await this.userModel.findOne({ email: email });
    }
}
