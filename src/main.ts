import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger, RequestMethod, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Config service
    const configService: ConfigService = app.get(ConfigService);

    // Enable CORS
    app.enableCors();

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // Set global prefix
    app.setGlobalPrefix("api/v1", {
        exclude: [{ path: "status", method: RequestMethod.GET }],
    });

    // Config Swagger
    const swaggerConfig = new DocumentBuilder()
        .setTitle("Movie Manager API")
        .setDescription("API documentation for the Movie Manager application")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, document);

    // Start the application
    const { port } = configService.get("server");
    await app.listen(port, () => {
        Logger.log(`Server is running on port ${port}`);
    });
}
bootstrap();
