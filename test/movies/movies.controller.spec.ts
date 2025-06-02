import { Test, TestingModule } from "@nestjs/testing";
import { MoviesController } from "../../src/movies/movies.controller";
import { MoviesService } from "../../src/movies/movies.service";
import { NotFoundException } from "@nestjs/common";

describe("MoviesController", () => {
    let controller: MoviesController;
    let moviesService: MoviesService;

    const mockMoviesService = {
        findAll: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        updateById: jest.fn(),
        deleteById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                {
                    provide: MoviesService,
                    useValue: mockMoviesService,
                },
            ],
        }).compile();

        controller = module.get<MoviesController>(MoviesController);
        moviesService = module.get<MoviesService>(MoviesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("createMovie", () => {
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
            jest.spyOn(moviesService, "create").mockResolvedValue(mockMovie);

            const result = await controller.createMovie(createMovieDto);
            expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
            expect(result).toEqual({
                id: mockMovie.id,
                title: mockMovie.title,
                director: mockMovie.director,
                producer: mockMovie.producer,
                releaseDate: mockMovie.releaseDate,
            });
        });
    });

    describe("getMovies", () => {
        it("should return a paginated list of movies", async () => {
            const query = { title: "ATest", page: 1, limit: 10 };
            const mockResponse = {
                data: [{ id: 1, title: "ATest" }],
                meta: {
                    totalItems: 1,
                    itemCount: 1,
                    itemsPerPage: 10,
                    totalPages: 1,
                    currentPage: 1,
                },
            };
            jest.spyOn(moviesService, "findAll").mockResolvedValue(mockResponse);

            const result = await controller.getMovies(query);
            expect(moviesService.findAll).toHaveBeenCalledWith(query);
            expect(result).toEqual(mockResponse);
        });
    });

    describe("getMovieById", () => {
        it("should return movie details by ID", async () => {
            const id = 1;
            const mockMovie: any = { id, title: "ATest", director: "George", producer: "Jhon", releaseDate: 1977 };
            jest.spyOn(moviesService, "findById").mockResolvedValue(mockMovie);

            const result = await controller.getMovieById(id);
            expect(moviesService.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockMovie);
        });
        it("should throw NotFoundException if movie not found", async () => {
            const id = 999;
            jest.spyOn(moviesService, "findById").mockRejectedValue(new NotFoundException(`Movie with ID ${id} not found`));

            await expect(controller.getMovieById(id)).rejects.toThrow(NotFoundException);
            expect(moviesService.findById).toHaveBeenCalledWith(id);
        });
    });
    describe("updateMovie", () => {
        it("should update a movie and return its details", async () => {
            const id = 1;
            const updateMovieDto = {
                title: "Updated Title",
                director: "Updated Director",
                producer: "Updated Producer",
                releaseDate: 1980,
            };
            const mockMovie: any = {
                id,
                ...updateMovieDto,
            };
            jest.spyOn(moviesService, "findById").mockResolvedValue(mockMovie);
            jest.spyOn(moviesService, "updateById").mockResolvedValue(mockMovie);

            const result = await controller.updateMovie(id, updateMovieDto);
            expect(mockMoviesService.updateById).toHaveBeenCalledWith(id, updateMovieDto);
            expect(result).toEqual({
                id: mockMovie.id,
                title: mockMovie.title,
                director: mockMovie.director,
                producer: mockMovie.producer,
                releaseDate: mockMovie.releaseDate,
            });
        });

        it("should throw NotFoundException if movie to update does not exist", async () => {
            const id = 999;
            const updateMovieDto = { title: "Nonexistent Movie" };

            jest.spyOn(moviesService, "updateById").mockRejectedValue(new NotFoundException(`Movie with ID ${id} not found`));
            await expect(controller.updateMovie(id, updateMovieDto)).rejects.toThrow(NotFoundException);
            expect(moviesService.updateById).toHaveBeenCalledWith(id, updateMovieDto);
        });
    });

    describe("deleteMovie", () => {
        it("should delete a movie by ID", async () => {
            const id = 1;
            jest.spyOn(moviesService, "deleteById").mockResolvedValue();

            await controller.deleteMovie(id);
            expect(moviesService.deleteById).toHaveBeenCalledWith(id);
        });
        it("should throw NotFoundException if movie to delete does not exist", async () => {
            const id = 999;
            jest.spyOn(moviesService, "deleteById").mockRejectedValue(new NotFoundException(`Movie with ID ${id} not found`));

            await expect(controller.deleteMovie(id)).rejects.toThrow(NotFoundException);
            expect(moviesService.deleteById).toHaveBeenCalledWith(id);
        });
    });
});
