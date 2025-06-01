import { UserRole } from "../../common/enums/user.enums";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "varchar",
        length: 50,
        default: UserRole.REGULAR_USER,
    })
    role: string;
}
