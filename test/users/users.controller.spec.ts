import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../../src/users/users.controller";
import { User } from "../../src/users/entities/user.entity";
import { JwtAuthGuard } from "../../src/auth/guards/jwt-auth.guard";

describe("UsersController", () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true }) // Mock del guard
            .compile();

        controller = module.get<UsersController>(UsersController);
    });

    describe("getProfile", () => {
        it("should return the current authenticated user", () => {
            const mockUser = {
                id: 1,
                email: "test@example.com",
                role: "REGULAR_USER",
            } as User;

            const result = controller.getProfile(mockUser);
            expect(result).toEqual(mockUser);
        });
    });
});
