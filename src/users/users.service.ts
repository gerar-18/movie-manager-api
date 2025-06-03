import { Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "../common/dto/create-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<Omit<User, "password">> {
        const { email, password, role } = createUserDto;

        const exists = await this.userRepository.findOne({ where: { email } });
        if (exists) {
            throw new ConflictException("Email is already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            role,
        });

        const savedUser = await this.userRepository.save(user);

        const userWithoutPassword = {
            id: savedUser.id,
            email: savedUser.email,
            role: savedUser.role,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
        };
        return userWithoutPassword;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }
}
