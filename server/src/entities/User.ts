import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class User {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property()
    createdAt: Date = new Date();

    @Field()
    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Field()
    @Property({unique: true})
    username!: string;

    // @Field()
    // @Property({unique: true})
    // email!: string;

    @Property()
    password!: string;
}