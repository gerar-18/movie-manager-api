import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configModuleOptions } from "./config/config.options";

@Global()
@Module({
    imports: [ConfigModule.forRoot(configModuleOptions)],
    controllers: [],
    providers: [],
    exports: [],
})
export class CoreModule {}