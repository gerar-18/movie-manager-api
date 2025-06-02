import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ILike } from "typeorm";
import { Movie } from "../../src/movies/entities/movie.entity";
import { MoviesService } from "../../src/movies/movies.service";
import { NotFoundException } from "@nestjs/common";

describe("MoviesService", () => {
    let service: MoviesService;
    let movieRepository: any;

    const mockRepository = {
        findAndCount: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MoviesService,
                {
                    provide: getRepositoryToken(Movie),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
        movieRepository = module.get("MovieRepository");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a new movie and return its details", async () => {
            const createMovieDto = {
                title: "ATest",
                director: "George",
                producer: "Jhon",
                releaseDate: 1977,
            };
            const mockMovie = {
                id: 1,
                ...createMovieDto,
            };
            jest.spyOn(movieRepository, "create").mockReturnValue(mockMovie);
            jest.spyOn(movieRepository, "save").mockResolvedValue(mockMovie);
            const result = await service.create(createMovieDto);
            expect(movieRepository.create).toHaveBeenCalledWith(createMovieDto);
            expect(movieRepository.save).toHaveBeenCalledWith(mockMovie);
            expect(result).toEqual({
                id: mockMovie.id,
                title: mockMovie.title,
                director: mockMovie.director,
                producer: mockMovie.producer,
                releaseDate: mockMovie.releaseDate,
            });
        });
    });

    describe("findAll", () => {
        it("should return paginated list of movies with only id and title", async () => {
            const mockMovies = [
                { id: 1, title: "Ted" },
                { id: 2, title: "Spiderman" },
            ];
            const total = 2;

            jest.spyOn(movieRepository, "findAndCount").mockResolvedValue([mockMovies, total]);

            const result = await service.findAll({});

            expect(movieRepository.findAndCount).toHaveBeenCalledWith({
                where: {},
                select: ["id", "title"],
                take: 10,
                skip: 0,
            });

            expect(result).toEqual({
                data: mockMovies,
                meta: {
                    totalItems: 2,
                    itemCount: 2,
                    itemsPerPage: 10,
                    totalPages: 1,
                    currentPage: 1,
                },
            });
        });

        it("should handle title filter", async () => {
            const title = "Iron Man";
            const mockMovies = [{ id: 1, title: "Iron Man" }];
            const total = 1;

            jest.spyOn(movieRepository, "findAndCount").mockResolvedValue([mockMovies, total]);

            const result = await service.findAll({ title });

            expect(movieRepository.findAndCount).toHaveBeenCalledWith({
                where: { title: ILike(`%${title}%`) },
                select: ["id", "title"],
                take: 10,
                skip: 0,
            });

            expect(result.data).toEqual(mockMovies);
        });

        it("should handle custom pagination", async () => {
            const mockMovies = [{ id: 3, title: "Capitan" }];
            const total = 1;

            jest.spyOn(movieRepository, "findAndCount").mockResolvedValue([mockMovies, total]);

            const result = await service.findAll({ page: 2, limit: 1 });

            expect(movieRepository.findAndCount).toHaveBeenCalledWith({
                where: {},
                select: ["id", "title"],
                take: 1,
                skip: 1,
            });

            expect(result.meta).toEqual({
                totalItems: 1,
                itemCount: 1,
                itemsPerPage: 1,
                totalPages: 1,
                currentPage: 2,
            });
        });
    });

    describe("findOne", () => {
        it("should return a movie by ID", async () => {
            const mockMovie = { id: 1, title: "Capitan" };
            jest.spyOn(movieRepository, "findOne").mockResolvedValue(mockMovie);

            const result = await service.findById(1);
            expect(result).toEqual(mockMovie);
        });

        it("should throw NotFoundException if movie not found", async () => {
            jest.spyOn(movieRepository, "findOne").mockResolvedValue(null);

            await expect(service.findById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe("updateById", () => {
        it("should update a movie and return its details", async () => {
            const updateMovieDto = {
                title: "Updated Title",
                director: "Updated Director",
                producer: "Updated Producer",
                releaseDate: 1980,
            };
            const mockMovie: any = {
                id: 1,
                ...updateMovieDto,
            };
            jest.spyOn(service, "findById").mockResolvedValue(mockMovie);
            jest.spyOn(movieRepository, "save").mockResolvedValue(mockMovie);

            const result = await service.updateById(1, updateMovieDto);

            expect(service.findById).toHaveBeenCalledWith(1);
            expect(movieRepository.save).toHaveBeenCalledWith({
                ...mockMovie,
                ...updateMovieDto,
            });
            expect(result).toEqual({
                id: mockMovie.id,
                title: mockMovie.title,
                director: mockMovie.director,
                producer: mockMovie.producer,
                releaseDate: mockMovie.releaseDate,
            });
        });

        it("should throw NotFoundException if movie to update does not exist", async () => {
            jest.spyOn(service, "findById").mockRejectedValue(new NotFoundException("Movie not found"));

            await expect(service.updateById(1, {})).rejects.toThrow(NotFoundException);
        });
    });

    describe("deleteById", () => {
        it("should delete a movie by ID", async () => {
            jest.spyOn(movieRepository, "delete").mockResolvedValue({ affected: 1 });

            await service.deleteById(1);

            expect(movieRepository.delete).toHaveBeenCalledWith(1);
        });

        it("should throw NotFoundException if movie to delete does not exist", async () => {
            jest.spyOn(movieRepository, "delete").mockResolvedValue({ affected: 0 });

            await expect(service.deleteById(1)).rejects.toThrow(NotFoundException);
        });
    });
});
