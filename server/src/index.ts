import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import cors from 'cors';

import Redis from "ioredis";
import session from "express-session";
import connectRedis from 'connect-redis';

import {HelloResolver} from "./resolvers/hello";
import {PostResolver} from "./resolvers/post";
import {UserResolver} from "./resolvers/user";
import {CLIENT, COOKIE_NAME} from "./constants";
import {MyContext} from "./types";
import {Post} from "./entities/Post";
import {User} from "./entities/User";

require('dotenv').config();

const app = async () => {
    await createConnection({
        type: 'postgres',
        database: 'Notatbokene',
        username: `${process.env.POSTGRES_USER}`,
        password: `${process.env.POSTGRES_PASSWORD}`,
        logging: true,
        synchronize: true,
        entities: [Post, User]
    });

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
        cors({
            origin: CLIENT,
            credentials: true
        })
    );

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 90, //3 month
                httpOnly: true,
                sameSite: "lax",
                secure: false
            },
            saveUninitialized: false,
            secret: `${process.env.REDIS_SECRET}`,
            resave: false
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}: MyContext): MyContext => ({ req, res, redis})
    });

    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(4000, () => {
        console.log("Done! http://localhost:4000/graphql");
    });
}

app();