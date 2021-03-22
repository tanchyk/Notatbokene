import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver} from "type-graphql";
import {MyContext} from "../types";
import {User} from "../entities/User";
import argon2 from "argon2";
import {assertWrappingType} from "graphql";

@InputType()
class UserInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];
    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    async me(
        @Ctx() {req, em}: MyContext
    ) {
        if(!req.session.userId) {
            return null;
        } else {
            return await em.findOne(User, {id: req.session.userId});
        }
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("input") input: UserInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        if(input.username.length <= 3) {
            return {
                errors: [{
                    field: "username",
                    message: "Username should be greater than 3"
                }]
            }
        } else if(input.password.length <= 3) {
            return {
                errors: [{
                    field: "password",
                    message: "Password should be greater than 3"
                }]
            }
        }

        const hashedPassword = await argon2.hash(input.password);
        const user = await em.create(User, {
            username: input.username,
            password: hashedPassword
        });

        try {
            await em.persistAndFlush(user);
        } catch(err) {
            if(err.detail.includes("already exists")) {
                return {
                    errors: [{
                        field: "username",
                        message: "Username is already taken"
                    }]
                }
            }
        }

        req.session.userId = user.id;

        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("input") input: UserInput,
        @Ctx() {em, req}: MyContext
    ):Promise<UserResponse> {
        const user = await em.findOne(User,{username: input.username});
        if(!user) {
            return {
                errors: [{
                    field: "username",
                    message: "that username doesn't exist"
                }]
            }
        }

        const valid = await argon2.verify(user.password, input.password);
        if(!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "incorrect password"
                }]
            }
        }

        req.session.userId = user.id;

        return {
            user
        }
    }
}