import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../src/auth/auth.controller";
import { AuthService } from "../../src/auth/auth.service";
import { CreateUserDto } from "../../src/common/dto/create-user.dto";
import { UserRole } from "src/common/enums/user.enums";

describe("AuthController", () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockService = {
        register: jest.fn(),
        login: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(authController).toBeDefined();
    });

    describe("register", () => {
        const createUserDto: CreateUserDto = { email: "test@test.com", password: "testpass", role: UserRole.REGULAR_USER };
        it("should call AuthService.register", async () => {
            const date = new Date();
            jest.spyOn(authService, "register").mockResolvedValue({
                id: 1,
                email: createUserDto.email,
                role: createUserDto.role,
                createdAt: date,
                updatedAt: date,
            });
            const result = await authController.register(createUserDto);
            expect(result).toEqual({ id: 1, email: createUserDto.email, role: createUserDto.role, createdAt: date, updatedAt: date });
            expect(authService.register).toHaveBeenCalledWith(createUserDto);
        });

        it("should throw if AuthService.register throws", async () => {
            jest.spyOn(authService, "register").mockRejectedValue(new Error("Email is already registered"));

            await expect(authController.register(createUserDto)).rejects.toThrow("Email is already registered");
            expect(authService.register).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe("login", () => {
        it("should call AuthService.login when login is called", async () => {
            const loginDto = { email: "test@test.com", password: "testpass" };
            const accessToken = "asdedef12dedesd";
            jest.spyOn(authService, "login").mockResolvedValue({ accessToken });

            const result = await authController.login(loginDto as any);

            expect(result).toEqual({ accessToken });
            expect(authService.login).toHaveBeenCalledWith(loginDto);
        });

        it("should throw error if AuthService.login throws", async () => {
            const loginDto = { email: "test@test.com", password: "wrongpassword" };
            const error = new Error("Invalid credentials");
            jest.spyOn(authService, "login").mockRejectedValue(error);

            await expect(authController.login(loginDto as any)).rejects.toThrow("Invalid credentials");
            expect(authService.login).toHaveBeenCalledWith(loginDto);
        });
    });
});
