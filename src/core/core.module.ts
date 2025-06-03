import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configModuleOptions } from "./config/config.options";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigType } from "./config/types/database-config.type";

@Global()
@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const databaseConfig = configService.get<DatabaseConfigType>("database");
                // This feature is for Railway deployment compatibility.
                if (databaseConfig.url) {
                    return {
                        type: "postgres",
                        url: databaseConfig.url,
                        synchronize: false,
                        autoLoadEntities: true,
                        migrations: ["dist/migrations/*.js"],
                        migrationsRun: true,
                    };
                }
                return {
                    type: "postgres",
                    host: databaseConfig.host,
                    port: databaseConfig.port,
                    username: databaseConfig.username,
                    password: databaseConfig.password,
                    database: databaseConfig.database,
                    synchronize: false,
                    autoLoadEntities: true,
                    migrations: ["dist/migrations/*.js"],
                    migrationsRun: true,
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class CoreModule {}
