import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../../common/enums/user.enums";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRoles) return true; // If no roles are required, allow access

        // Get the user from the request object (JWT)
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user.role);
    }
}
