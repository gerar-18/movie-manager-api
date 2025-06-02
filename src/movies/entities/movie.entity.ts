import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    episodeId?: number;

    @Column({ type: "text", nullable: true })
    openingCrawl?: string;

    @Column({ nullable: true })
    director?: string;

    @Column({ nullable: true })
    producer?: string;

    @Column({ nullable: true })
    release_date?: string;

    @Column({ default: false })
    isFromSwapi: boolean;

    @Column({ nullable: true, unique: true })
    swapiId?: string;

    // Timestamps
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}
