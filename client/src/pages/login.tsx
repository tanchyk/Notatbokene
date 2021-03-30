import React from "react";
import {Formik, Form} from 'formik';
import {Button, Flex, Link} from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";
import {MeDocument, MeQuery, useLoginMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";
import NextLink from 'next/link';
import {withApollo} from "../utils/withApollo";

const Login: React.FC = ({}) => {
    const router = useRouter();
    const [login] = useLoginMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{
                    usernameOrEmail: "",
                    password: ""
                }}
                onSubmit={async (values, {setErrors}) => {
                    const response = await login({
                        variables: values,
                        update: (
                            cache,
                            {data}
                        ) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                    __typename: 'Query',
                                    me: data?.login.user
                                },
                            });
                            cache.evict({fieldName: "posts"})
                        }
                    });

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

export default withApollo({ssr: false})(Login);