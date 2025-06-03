import { AuthService } from "../../src/auth/auth.service";
import { UsersService } from "../../src/users/users.service";
import { CreateUserDto } from "../../src/common/dto/create-user.dto";
import { UserRole } from "../../src/common/enums/user.enums";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

describe("AuthService", () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    // Mock UsersService
    const mockUserService = {
        create: jest.fn(),
        findByEmail: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: mockUserService }, { provide: JwtService, useValue: mockJwtService }],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(authService).toBeDefined();
    });

    describe("register", () => {
        it("should register a new user", async () => {
            const createUserDto: CreateUserDto = { email: "test@test.com", password: "testpass", role: UserRole.REGULAR_USER };
            const date = new Date();
            const expectedResult = { id: 1, email: createUserDto.email, role: createUserDto.role, createdAt: date, updatedAt: date };
            jest.spyOn(usersService, "create").mockResolvedValue(expectedResult);
            const result = await authService.register(createUserDto);
            expect(result).toEqual(expectedResult);
            expect(usersService.create).toHaveBeenCalledWith(createUserDto);
        });

        it("should throw if usersService.create throws", async () => {
            const createUserDto: CreateUserDto = { email: "fail@test.com", password: "failpass", role: UserRole.REGULAR_USER };
            jest.spyOn(usersService, "create").mockRejectedValue(new Error("Email is already registered"));

            await expect(authService.register(createUserDto)).rejects.toThrow("Email is already registered");
            expect(usersService.create).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe("login", () => {
        const loginDto = { email: "test@test.com", password: "testpass" };

        it("should return accessToken for valid credentials", async () => {
            const user: any = { id: 1, email: loginDto.email, password: "hashedpass", role: UserRole.REGULAR_USER };
            jest.spyOn(usersService, "findByEmail").mockResolvedValue(user);
            (jest.spyOn(bcrypt, "compare") as jest.SpyInstance).mockResolvedValue(true);
            jest.spyOn(jwtService, "signAsync").mockResolvedValue("jwt-token");

            const result = await authService.login(loginDto);

            expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
            expect(result).toEqual({ accessToken: "jwt-token" });
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                id: user.id,
                email: user.email,
                role: user.role,
            });
        });

        it("should throw UnauthorizedException if user not found", async () => {
            jest.spyOn(usersService, "findByEmail").mockResolvedValue(null);

            await expect(authService.login(loginDto)).rejects.toThrow("Invalid credentials");
            expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
        });

        it("should throw UnauthorizedException if password is invalid", async () => {
            const user: any = { id: 1, email: loginDto.email, password: "hashedpass", role: UserRole.REGULAR_USER };
            jest.spyOn(usersService, "findByEmail").mockResolvedValue(user);
            (jest.spyOn(bcrypt, "compare") as jest.SpyInstance).mockResolvedValue(false);

            await expect(authService.login(loginDto)).rejects.toThrow("Invalid credentials");
            expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
        });
    });
});
