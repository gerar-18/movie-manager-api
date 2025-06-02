import { AuthService } from "../../src/auth/auth.service";
import { UsersService } from "../../src/users/users.service";
import { CreateUserDto } from "../../src/common/dto/create-user.dto";
import { UserRole } from "../../src/common/enums/user.enums";
import { Test, TestingModule } from "@nestjs/testing";

describe("AuthService", () => {
    let authService: AuthService;
    let usersService: UsersService;

    // Mock UsersService
    const mockUserService = {
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: mockUserService }],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(authService).toBeDefined();
    });

    it("should register a new user", async () => {
        const createUserDto: CreateUserDto = { email: "test@test.com", password: "testpass", role: UserRole.REGULAR_USER };
        const date = new Date();
        const expectedResult = { id: 1, email: createUserDto.email, role: createUserDto.role, createdAt: date, updatedAt: date };
        jest.spyOn(usersService, "create").mockResolvedValue(expectedResult);
        const result = await authService.register(createUserDto);
        expect(result).toEqual(expectedResult);
        expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
});
