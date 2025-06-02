import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { MoviesService } from "./movies.service";
import { MovieResponseDto } from "./dto/movie-response.dto";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { MovieListItemDto } from "./dto/movie-list-item.dto";
import { GetMoviesQueryDto } from "./dto/get-movies-query.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user.enums";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Movie } from "./entities/movie.entity";

@ApiTags("Movies")
@ApiBearerAuth()
@Controller("movies")
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiCreatedResponse({
        description: "Movie successfully created",
        type: MovieResponseDto,
    })
    @ApiBadRequestResponse({
        description: "Invalid input data",
    })
    async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
        const movie = await this.moviesService.create(createMovieDto);
        return movie;
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: "List of movies with pagination info",
        type: PaginatedResponseDto<MovieListItemDto>,
    })
    async getMovies(@Query() query: GetMoviesQueryDto): Promise<PaginatedResponseDto<MovieListItemDto>> {
        return this.moviesService.findAll(query);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.REGULAR_USER)
    @ApiOkResponse({
        description: "Returns movie details",
        type: Movie,
    })
    @ApiNotFoundResponse({
        description: "Movie not found",
    })
    async getMovieById(@Query("id") id: number): Promise<Movie> {
        const movie = await this.moviesService.findById(id);
        return movie;
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({
        description: "Movie successfully updated",
        type: MovieResponseDto,
    })
    @ApiNotFoundResponse({
        description: "Movie not found",
    })
    @ApiBadRequestResponse({
        description: "Invalid input data",
    })
    async updateMovie(@Query("id") id: number, @Body() updateMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
        return this.moviesService.updateById(id, updateMovieDto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({
        description: "Movie successfully deleted",
    })
    @ApiNotFoundResponse({
        description: "Movie not found",
    })
    async deleteMovie(@Query("id") id: number): Promise<void> {
        await this.moviesService.deleteById(id);
    }
}
