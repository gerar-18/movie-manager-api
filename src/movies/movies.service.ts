import { Injectable, NotFoundException } from "@nestjs/common";
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

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
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
}
