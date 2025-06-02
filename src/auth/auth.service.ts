import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../common/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    // Method to register a new user
    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
