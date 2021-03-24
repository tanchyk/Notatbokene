import {UserInput} from "../resolvers/InputTypes";

export const validateRegister = (input: UserInput) => {
    if (input.username.length <= 3) {
        return [{
            field: "username",
            message: "Username should be greater than 3"
        }]
    } else if (input.username.includes('@')) {
        return [{
            field: "username",
            message: "Username could not include @"
        }]
    } else if (input.password.length <= 3) {
        return [{
            field: "password",
            message: "Password should be greater than 3"
        }]
    } else if (!input.email.includes('@')) {
        return [{
            field: "email",
            message: "Invalid Email"
        }]
    }

    return null;
}