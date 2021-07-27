import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async login({ email, password }: LoginDto) {
        const user = await this.usersService.findByEmail(email, true);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        const isPassowrdValid = await bcrypt.compare(password, user.password)
        if (!isPassowrdValid) {
            throw new UnauthorizedException();
        }
        const payload = {
            sub: user._id,
            name: user.name
        };

        user.password = null;

        return {
            result: user,
            access_token: this.jwtService.sign(payload),
        };
    }
}
