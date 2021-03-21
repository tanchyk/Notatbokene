import "reflect-metadata";
import {MikroORM} from "@mikro-orm/core";
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql'
import {HelloResolver} from "./resolvers/hello";
import {PostResolver} from "./resolvers/post";

const app = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({em: orm.em})
    });

    apolloServer.applyMiddleware({app});

    app.listen(4000, () => {
        console.log("Done! http://localhost:4000/graphql");
    });
}

app();