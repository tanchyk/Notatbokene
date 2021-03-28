import {Request, Response} from "express";
import {Session, SessionData} from "express-session";
import Redis from "ioredis";
import {createUpvoteLoader, createUserLoader} from "./utils/createUserLoader";


export interface MyContext {
    req: Request & { session: Session & Partial<SessionData> & { userId: number } };
    res: Response;
    redis: Redis.Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    upvoteLoader: ReturnType<typeof createUpvoteLoader>;
}