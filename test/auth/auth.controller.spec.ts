import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../src/auth/auth.controller";
import { AuthService } from "../../src/auth/auth.service";
import { CreateUserDto } from "../../src/common/dto/create-user.dto";
import { UserRole } from "src/common/enums/user.enums";

describe("AuthController", () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn(),
                    },
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

    it("should call AuthService.register when register is called", async () => {
        const createUserDto: CreateUserDto = { email: "test@test.com", password: "testpass", role: UserRole.REGULAR_USER };
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
});
