import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { ResponseError } from "../error/response-error";
import { prismaClient } from "../application/database";

dotenv.config();

const getToken = (authHeader: string) => {
    const splitHeader = authHeader.split(' ');
    return splitHeader.length > 1 ? splitHeader[1] : splitHeader[0];
}

const authorized = async (authorization: string | undefined) => {
    try {
        if (!authorization || typeof authorization !== 'string') {
            return null;
        }

        const token = getToken(authorization);
        const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";
        const payload: any = jwt.verify(token, secretKey);

        const user = await prismaClient.user.findUnique({
            where: {
                id: payload.id
            },
        })

       
        if (!user) {
            return null
        }
        const user_data = {
            id: payload.id,
            username: payload.username,
            roles: payload.roles
        };

        return user_data;
    } catch (err) {
        return null;
    }
};

const user = (req: any, res: any, next: any) => {
    const { authorization } = req.headers;
    const user = authorized(authorization);

    if (!user) {
        throw new ResponseError(400, "Unauthorized");
    }

    req.user = user;
    next();

}
const test = (req: any, res: any, next: any) => {
    console.log(req.headers)

    next();
}

export default { user, test };
