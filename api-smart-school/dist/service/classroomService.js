"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_validator_1 = require("class-transformer-validator");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const create_or_update_classroom_dto_1 = require("../dto/create-or-update-classroom.dto");
const move_student_classroom_dto_1 = require("../dto/move-student-classroom.dto");
class ClassroomService {
    constructor() {
    }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, class_transformer_validator_1.transformAndValidate)(create_or_update_classroom_dto_1.CreateOrUpdateClassroomDto, request);
            }
            catch (e) {
                throw new response_error_1.ResponseError(400, e.toString());
            }
            const classMajor = yield database_1.prismaClient.classMajor.findFirst({
                where: { id: request.class_major_id },
            });
            if (!classMajor) {
                throw new response_error_1.ResponseError(404, "class major not found!");
            }
            return yield database_1.prismaClient.classroom.create({
                data: request,
                select: {
                    id: true,
                    code: true,
                    year_group: true,
                    level: true,
                    class_major_id: true,
                    status: true,
                },
            });
        });
    }
    get(request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
            const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
            const skip = (parseInt(page) - 1) * parseInt(size);
            const filters = [];
            const sorting = {};
            if (request.code) {
                filters.push({
                    code: {
                        contains: request.code,
                    },
                });
            }
            if (request.level) {
                filters.push({
                    level: {
                        contains: request.level,
                    },
                });
            }
            if (request.year_group) {
                filters.push({
                    year_group: {
                        equals: request.year_group,
                    },
                });
            }
            if (request.status) {
                filters.push({
                    status: {
                        equals: request.status,
                    },
                });
            }
            if (request.class_major_id) {
                filters.push({
                    class_major_id: {
                        equals: parseInt(request.class_major_id),
                    },
                });
            }
            let orders = {
                [request.orderBy || 'created_at']: request.sortBy || 'desc',
            };
            const classrooms = yield database_1.prismaClient.classroom.findMany({
                orderBy: orders,
                where: {
                    AND: filters,
                },
                include: {
                    classMajor: true,
                },
                take: parseInt(size),
                skip: skip,
            });
            const totalItems = yield database_1.prismaClient.classroom.count({
                where: {
                    AND: filters,
                },
            });
            return {
                data: classrooms,
                paging: {
                    page: page,
                    total_item: totalItems,
                    total_page: Math.ceil(totalItems / parseInt(size)),
                },
            };
        });
    }
    moveStudent(request, classroom_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, class_transformer_validator_1.transformAndValidate)(move_student_classroom_dto_1.MoveStudentClassroomDto, request);
            }
            catch (e) {
                throw new response_error_1.ResponseError(400, e.toString());
            }
            const classroom = yield database_1.prismaClient.classroom.findUnique({
                where: {
                    id: classroom_id
                }
            });
            if (!classroom) {
                throw new response_error_1.ResponseError(404, "classroom not found!");
            }
            const students = request.students;
            for (const data of students) {
                if (data.id) {
                    yield database_1.prismaClient.studentClassroom.create({
                        data: {
                            student_id: data.id,
                            classroom_id: classroom_id
                        }
                    });
                }
                yield database_1.prismaClient.student.update({
                    where: {
                        id: data.id,
                    },
                    data: {
                        current_classroom_id: classroom_id
                    }
                });
            }
        });
    }
}
exports.default = ClassroomService;
//# sourceMappingURL=classroomService.js.map