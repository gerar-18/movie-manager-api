import { Reflector } from "@nestjs/core";
import { ROLES_KEY, Roles } from "../../../src/auth/decorators/roles.decorator";
import { UserRole } from "../../../src/common/enums/user.enums";

describe("Roles Decorator", () => {
    it("should define metadata for roles", () => {
        class TestClass {
            @Roles(UserRole.ADMIN, UserRole.REGULAR_USER)
            testMethod() {}
        }

        const reflector = new Reflector();
        const roles = reflector.get(ROLES_KEY, TestClass.prototype.testMethod);
        expect(roles).toEqual(["admin", "regular_user"]);
    });
});
