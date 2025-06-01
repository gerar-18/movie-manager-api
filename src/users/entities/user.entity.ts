import { UserRole } from "../../common/enums/user.enums";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.REGULAR_USER,
    })
    role: UserRole;
}
