import {__prod__} from "./constants";
import {Post} from "./entities/Post";
import {Configuration, Connection, IDatabaseDriver, Options} from "@mikro-orm/core";
import {User} from "./entities/User";
const path = require('path');
require('dotenv').config();

export default {
    dbName: 'Notatbokene',
    type: 'postgresql',
    debug: !__prod__,
    user: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    entities: [Post, User],
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/
    }
} as Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>>;