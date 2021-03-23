import React from "react";
import {Formik, Form} from 'formik';
import {Button} from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";
import {useLoginMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";

interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
    const router = useRouter();
    const [{},login] = useLoginMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{
                    username: "",
                    password: ""
                }}
                onSubmit={async (values, {setErrors}) => {
                    const response = await login(values);
                    console.log(response)
                    if(response.data?.login?.errors) {
                        return setErrors(toErrorMap(response.data.login.errors));
                    } else if(response.data?.login.user) {
                        return router.push('/');
                    }
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField
                            name="username"
                            label="Username"
                            placeholder="Username"
                        />
                        <InputField
                            name="password"
                            label="Password"
                            placeholder="Password"
                        />
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default Login;