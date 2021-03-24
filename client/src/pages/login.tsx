import React from "react";
import {Formik, Form} from 'formik';
import {Button, Flex, Link} from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";
import {useLoginMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import NextLink from 'next/link';

interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
    const router = useRouter();
    const [{},login] = useLoginMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{
                    usernameOrEmail: "",
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
                            name="usernameOrEmail"
                            label="Username or Email"
                            placeholder="Username or Email"
                        />
                        <InputField
                            name="password"
                            label="Password"
                            placeholder="Password"
                        />
                        <Flex direction="row" alignItems="center" mt={4}>
                            <Button
                                mr={2}
                                type="submit"
                                isLoading={isSubmitting}
                            >
                                Login
                            </Button>
                            <NextLink href="/forgot-password">
                                <Link>
                                    Forgot Password
                                </Link>
                            </NextLink>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);