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
const database_1 = require("../application/database");
class ClassMajorService {
    get(request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = request.page) !== null && _a !== void 0 ? _a : 1;
            const size = (_b = request.size) !== null && _b !== void 0 ? _b : 10;
            const skip = (parseInt(page) - 1) * parseInt(size);
            const filters = [];
            if (request.name) {
                filters.push({
                    name: {
                        contains: request.name
                    }
                });
            }
            let orders = {
                [request.orderBy || 'created_at']: request.sortBy || 'desc',
            };
            const classmajor = yield database_1.prismaClient.classMajor.findMany({
                orderBy: orders,
                where: {
                    AND: filters
                },
                include: {
                    classrooms: true
                },
                take: parseInt(size),
                skip: skip,
            });
            const totalItems = yield database_1.prismaClient.classMajor.count({
                where: {
                    AND: filters
                }
            });
            return {
                data: classmajor,
                paging: {
                    page: page,
                    total_item: totalItems,
                    total_page: Math.ceil(totalItems / parseInt(size))
                }
            };
        });
    }
}
exports.default = ClassMajorService;
//# sourceMappingURL=classMajorService.js.map