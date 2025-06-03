import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Movie } from "./entities/movie.entity";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { MovieResponseDto } from "./dto/movie-response.dto";
import { GetMoviesQueryDto } from "./dto/get-movies-query.dto";
import { PaginatedResponseDto } from "src/common/dto/paginated-response.dto";
import { MovieListItemDto } from "./dto/movie-list-item.dto";
import { PaginationMeta } from "../common/dto/paginated-response.dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { SyncResponseDto } from "./dto/sync-response.dto";
import { SwapiFilmResponseDto } from "./dto/swapi-film-response.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MoviesService {
    private readonly logger = new Logger(MoviesService.name);

    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async create(createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
        const movie = this.movieRepository.create(createMovieDto);
        await this.movieRepository.save(movie);
        return {
            id: movie.id,
            title: movie.title,
            director: movie.director,
            producer: movie.producer,
            releaseDate: movie.releaseDate,
        };
    }

    async findAll(query: GetMoviesQueryDto): Promise<PaginatedResponseDto<MovieListItemDto>> {
        const { title, page = 1, limit = 10 } = query;

        const where = title ? { title: ILike(`%${title}%`) } : {};

        const [movies, total] = await this.movieRepository.findAndCount({
            where,
            select: ["id", "title"],
            take: limit,
            skip: (page - 1) * limit,
        });

        const meta: PaginationMeta = {
            totalItems: total,
            itemCount: movies.length,
            itemsPerPage: limit,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };

        return { data: movies, meta };
    }

    async findById(id: number): Promise<Movie> {
        const movie = await this.movieRepository.findOne({
            where: { id },
        });

        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }

        return movie;
    }

    async updateById(id: number, updateMovieDto: UpdateMovieDto): Promise<MovieResponseDto> {
        const movie = await this.findById(id);
        Object.assign(movie, updateMovieDto);
        await this.movieRepository.save(movie);
        return {
            id: movie.id,
            title: movie.title,
            director: movie.director,
            producer: movie.producer,
            releaseDate: movie.releaseDate,
        };
    }

    async deleteById(id: number): Promise<void> {
        const result = await this.movieRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
    }

    async fetchSwapiFilms(): Promise<SwapiFilmResponseDto> {
        try {
            const swapiUrl = this.configService.get<string>("swapi.url");
            if (!swapiUrl) {
                throw new Error("SWAPI URL is not configured");
            }
            const url = `${swapiUrl}/films`;
            const { data } = await firstValueFrom(this.httpService.get<SwapiFilmResponseDto>(url));
            return data;
        } catch (error) {
            this.logger.error("Failed to fetch SWAPI films", error.stack);
            throw new Error("SWAPI service unavailable");
        }
    }

    async syncWithSwapi(): Promise<SyncResponseDto> {
        this.logger.debug("Starting SWAPI sync");
        this.logger.debug("Fetching movies from SWAPI");
        try {
            const response = await this.fetchSwapiFilms();

            const swapiMovies = response.result;
            let newMoviesCount = 0;
            let existingMoviesCount = 0;
            const addedTitles: string[] = [];

            for (const swapiMovie of swapiMovies) {
                const existing = await this.movieRepository.findOneBy({
                    swapiId: swapiMovie.uid,
                });

                if (!existing) {
                    const newMovie = this.movieRepository.create({
                        title: swapiMovie.properties.title,
                        episodeId: swapiMovie.properties.episode_id,
                        openingCrawl: swapiMovie.properties.opening_crawl,
                        director: swapiMovie.properties.director,
                        producer: swapiMovie.properties.producer,
                        releaseDate: swapiMovie.properties.release_date,
                        isFromSwapi: true,
                        swapiId: swapiMovie.uid,
                    });

                    await this.movieRepository.save(newMovie);
                    newMoviesCount++;
                    addedTitles.push(swapiMovie.properties.title);
                } else {
                    existingMoviesCount++;
                }
            }

            return new SyncResponseDto({
                message: "Synchronization completed successfully",
                newMovies: newMoviesCount,
                existingMovies: existingMoviesCount,
                addedTitles: addedTitles,
                timestamp: new Date(),
            });
        } catch (error) {
            this.logger.error("Error during SWAPI sync", error);
            throw new Error("Failed to sync with SWAPI");
        }
    }
}
