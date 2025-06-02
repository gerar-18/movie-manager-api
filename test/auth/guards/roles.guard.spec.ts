import { RolesGuard } from "../../../src/auth/guards/roles.guard";
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
import { UserRole } from "../../../src/common/enums/user.enums";

describe("RolesGuard", () => {
    let guard: RolesGuard;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = { getAllAndOverride: jest.fn() } as any;
        guard = new RolesGuard(reflector);
    });

    const mockExecutionContext = (userRole?: UserRole) => {
        const req = { user: { role: userRole } };
        return {
            switchToHttp: () => ({
                getRequest: () => req,
            }),
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as unknown as ExecutionContext;
    };

    it("should allow access if no roles are required", () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
        const context = mockExecutionContext(UserRole.ADMIN);
        expect(guard.canActivate(context)).toBe(true);
    });

    it("should allow access if user has required role", () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([UserRole.ADMIN]);
        const context = mockExecutionContext(UserRole.ADMIN);
        expect(guard.canActivate(context)).toBe(true);
    });

    it("should deny access if user does not have required role", () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([UserRole.ADMIN]);
        const context = mockExecutionContext(UserRole.REGULAR_USER);
        expect(guard.canActivate(context)).toBe(false);
    });

    it("should deny access if user is missing from request", () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([UserRole.ADMIN]);
        const context = mockExecutionContext(undefined);
        expect(guard.canActivate(context)).toBe(false);
    });

    it("should allow access if requiredRoles is empty array", () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([]);
        const context = mockExecutionContext(UserRole.REGULAR_USER);
        expect(guard.canActivate(context)).toBe(true);
    });
});
