import { transformAndValidate } from "class-transformer-validator";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";
import {
    generateDefaultPassword,
    generateStaffUsername,
} from "../application/common/common";
import { CreateOrUpdateStaffDto } from "../dto/create-or-update-staffDto";
import { skip } from "node:test";

class StaffService {
    async get(request: any) {
        const page = request.page ?? 1;
        const size = request.size ?? 10;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const filters: any = [];

        if (request.nik) {
            filters.push({
                nik: {
                    equals: request.nik,
                },
            });
        }
        if (request.first_name) {
            filters.push({
                first_name: {
                    contains: request.first_name,
                    mode: "insensitive",
                },
            });
        }
        if (request.middle_name) {
            filters.push({
                middle_name: {
                    contains: request.middle_name,
                    mode: "insensitive",
                },
            });
        }
        if (request.last_name) {
            filters.push({
                last_name: {
                    contains: request.last_name,
                    mode: "insensitive",
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
        if (request.gender) {
            filters.push({
                status: {
                    gender: request.gender,
                },
            });
        }
        let include_course = false
        if (request.role_id) {
            filters.push({
                staff_user: {
                    some: {
                        user: {
                            user_roles: {
                                some: {
                                    role_id: parseInt(request.role_id),
                                },
                            },
                        },
                    },
                },
            });
            include_course = true
        }

        if (request.course_id) {
            filters.push({
                teacher_course: {
                    some: {
                        courses: {
                            id: parseInt(request.course_id
)                        }
                    }
                }
            })

        }


        let orders = {
            [request.orderBy || "created_at"]: request.sortBy || "desc",
        };

        const staff = await prismaClient.staff.findMany({
            orderBy: orders,

            where: {
                AND: filters,
            },

            include: {
                teacher_course: {
                    include: {
                        courses: include_course
                    }
                },
                staff_user: {
                    include: {
                        user: {
                            include: {
                                user_roles: {
                                    include: {
                                        role: true,
                                    },
                                },
                                user_permision: true,
                            },
                        },
                    },
                },
            },
            take: parseInt(size),
            skip: skip,
        });

        const totalItems = await prismaClient.staff.count({
            where: {
                AND: filters,
            },
        });

        return {
            data: staff,
            paging: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / parseInt(size)),
            },
        };
    }

    async create(request: any) {

        try {
            await transformAndValidate(CreateOrUpdateStaffDto, request);
        } catch (e: any) {
            throw new ResponseError(400, e.toString());
        }


        const staff = await prismaClient.staff.create({
            data: {
                nik: request.nik,
                first_name: request.first_name,
                middle_name: request.middle_name,
                last_name: request.last_name,
                birth_date: request.birth_date,
                birth_place: request.birth_place,
                gender: request.gender,
                foto_url: request.foto_url,
                religion: request.religion,
                phone: request.phone,
                email: request.email,
                address: request.address,
                status: "active",
            },
            select: {
                id: true,
            },
        });

        const defaultPassword = generateDefaultPassword(request.birth_date);
        const username = generateStaffUsername(
            request.birth_date,
            request.first_name
        );

        const user_data = {
            username: username,
            password: await bcrypt.hash(defaultPassword, 10),
        };

        const user = await prismaClient.user.create({
            data: user_data,
            select: {
                id: true,
            },
        });

        await prismaClient.staffUser.create({
            data: {
                staff_id: staff.id,
                user_id: user.id,
            },
        });
        const staff_roles = request.roles;

        for (const data of staff_roles) {
            await prismaClient.userRoles.create({
                data: {
                    user_id: user.id,
                    role_id: data.role_id,
                },
            });
        }

        return await prismaClient.staff.findFirst({
            where: {
                id: staff.id,
            },
            include: {
                staff_user: {
                    include: {
                        staff: true,
                        user: {
                            include: {
                                user_roles: true,
                                user_permision: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async update(request: any, id: string) {

        try {
            await transformAndValidate(CreateOrUpdateStaffDto, request, {
                validator: { skipMissingProperties: true }
            });
        } catch (e: any) {
            throw new ResponseError(400, e.toString());
        }

        const staff = await prismaClient.staff.findUnique({
            where: {
                id: id
            }
        })

        if (!staff) {
            throw new ResponseError(404, "staff not found")
        }

     await prismaClient.staff.update({
            where: {
                id: id,
            },
            data: {
                nik: request.nik,
                first_name: request.first_name,
                middle_name: request.middle_name,
                last_name: request.last_name,
                birth_date: request.birth_date,
                birth_place: request.birth_place,
                gender: request.gender,
                foto_url: request.foto_url,
                religion: request.religion,
                phone: request.phone,
                email: request.email,
                address: request.address,
                status: request.status,
            }
        });

        return await prismaClient.staff.findFirst({
            where: {
                id: staff.id
            }
        })

    }
}

export default StaffService;
