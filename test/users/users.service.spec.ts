import { UsersService } from "../../src/users/users.service";
import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../../src/users/entities/user.entity";
import { UserRole } from "../../src/common/enums/user.enums";

describe("UsersService", () => {
    let usersService: UsersService;
    let userRepository: any;

    const mockRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        userRepository = module.get("UserRepository");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(usersService).toBeDefined();
    });

    describe("create", () => {
        const createUserDto = {
            email: "test@example.com",
            password: "password123",
            role: UserRole.REGULAR_USER,
        };

        it("should throw ConflictException if email already exists", async () => {
            jest.spyOn(userRepository, "findOne").mockResolvedValue({
                id: 1,
                email: createUserDto.email,
            });
            await expect(usersService.create(createUserDto)).rejects.toThrow(ConflictException);
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
        });

        it("should hash the password and save the user", async () => {
            jest.spyOn(userRepository, "findOne").mockResolvedValue(null);
            jest.spyOn(userRepository, "create").mockImplementation(user => user);

            jest.spyOn(userRepository, "save").mockResolvedValue({
                id: 1,
                email: createUserDto.email,
                role: createUserDto.role,
                createdAt: new Date("2023-01-01"),
                updatedAt: new Date("2023-01-01"),
            });

            const hashed = await bcrypt.hash(createUserDto.password, 10);

            // Mock bcrypt.hash to return a fixed hashed value
            (jest.spyOn(bcrypt, "hash") as jest.SpyInstance).mockResolvedValue(hashed);

            const result = await usersService.create(createUserDto);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
            expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
            expect(userRepository.create).toHaveBeenCalledWith({
                email: createUserDto.email,
                password: hashed,
                role: createUserDto.role,
            });
            expect(userRepository.save).toHaveBeenCalled();

            expect(result).toEqual({
                id: 1,
                email: createUserDto.email,
                role: createUserDto.role,
                createdAt: new Date("2023-01-01"),
                updatedAt: new Date("2023-01-01"),
            });
            expect(result).not.toHaveProperty("password");
        });
    });

    describe("findByEmail", () => {
        const email = "findme@example.com";

        it("should return the user if found", async () => {
            const user = {
                id: 2,
                email,
                password: "hashedpassword",
                role: UserRole.REGULAR_USER,
                createdAt: new Date("2023-02-01"),
                updatedAt: new Date("2023-02-01"),
            };
            jest.spyOn(userRepository, "findOne").mockResolvedValue(user);

            const result = await usersService.findByEmail(email);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(result).toEqual(user);
        });

        it("should return null if user is not found", async () => {
            jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

            const result = await usersService.findByEmail(email);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(result).toBeNull();
        });
    });
});
