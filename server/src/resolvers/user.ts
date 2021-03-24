import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {MyContext} from "../types";
import {User} from "../entities/User";
import argon2 from "argon2";
import {COOKIE_NAME, CLIENT, FORGET_PASSWORD_PREFIX} from "../constants";
import {UserInput, UserResponse} from "./InputTypes";
import {validateRegister} from "../utils/validationFunctions";
import {transporter} from "../utils/sendEmail";
import {v4} from 'uuid';

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
        const errors = validateRegister(input);

        if(errors) {
            return {errors};
        }

        const hashedPassword = await argon2.hash(input.password);
        const user = await em.create(User, {
            username: input.username,
            email: input.email,
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
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() {em, req}: MyContext
    ):Promise<UserResponse> {
        const user = await em.findOne(User,
            usernameOrEmail.includes("@") ? {email: usernameOrEmail}
                : {username: usernameOrEmail}
        );
        if(!user) {
            return {
                errors: [{
                    field: "usernameOrEmail",
                    message: "User does't exist"
                }]
            }
        }

        const valid = await argon2.verify(user.password, password);
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

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ) {
        return new Promise(resolve => req.session.destroy(err => {
            if(err) {
                console.log(err);
                resolve(false);
            } else {
                res.clearCookie(COOKIE_NAME);
                resolve(true);
            }
        }));
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() {em, redis}: MyContext
    ) {
        const user = await em.findOne(User, {email});
        if(!user) {
            return true;
        }

        try {
            const token = v4();
            await redis.set(
                FORGET_PASSWORD_PREFIX + token,
                user.id,
                'ex',
                1000 * 60 * 60 * 24
            ); //1 day

            await transporter.sendMail({
                from: `${process.env.GMAIL_USER}`,
                to: user.email,
                subject: 'Change Password',
                html: `
                    <div style="margin: 40px; padding: 40px; border: 1px solid #4A5568; border-radius: 0.5rem; display: flex; flex-direction: row; flex-wrap: wrap;">
                        <div style="padding: 40px;">
                            <img style="width: 200px; height: 200px;" src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424748/mainpage/forgot_password_pcnkfd.png" />
                        </div>
                        <div style="padding: 40px;">
                            <h1>Please click this link to confirm your email: </h1>
                            <a href="${CLIENT}/change-password/${token}">Change Password</a>
                        </div>
                    </div>
                    `,
            });

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() {em, redis, req}:MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 3) {
            return {
                errors: [{
                    field: "newPassword",
                    message: "Password should be greater than 3"
                }]
            }
        }

        const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
        if(!userId) {
            return {
                errors: [{
                    field: "token",
                    message: "Token expired"
                }]
            }
        }

        const user = await em.findOne(User, {id: parseInt(userId)});

        if(!user) {
            return {
                errors: [{
                    field: "token",
                    message: "User no longer exists"
                }]
            }
        }

        user.password = await argon2.hash(newPassword);
        await em.persistAndFlush(user);

        await redis.del(FORGET_PASSWORD_PREFIX + token);

        req.session.userId = user.id;

        return { user };
    }
}