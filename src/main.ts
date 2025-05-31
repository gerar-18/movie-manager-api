import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Config service
    const configService: ConfigService = app.get(ConfigService);

    // Enable CORS
    app.enableCors();

    // Set global prefix
    app.setGlobalPrefix("api/v1");

    // Start the application
    const { port } = configService.get("server");
    await app.listen(port, () => {
        Logger.log(`Server is running on port ${port}`);
    });
}
bootstrap();
