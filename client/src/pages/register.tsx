import React from "react";
import {Form, Formik} from 'formik';
import {Button} from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";
import {MeDocument, MeQuery, useRegisterMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {withApollo} from "../utils/withApollo";

const Register: React.FC = ({}) => {
    const router = useRouter();
    const [register] = useRegisterMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{
                    username: "",
                    email: "",
                    password: ""
                }}
                onSubmit={async (values, {setErrors}) => {
                    const response = await register({
                        variables: values,
                        update: (
                            cache,
                            {data}
                        ) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                    __typename: 'Query',
                                    me: data?.register.user
                                },
                            })
                        }
                    });

                    if(response.data?.register?.errors) {
                        return setErrors(toErrorMap(response.data.register.errors));
                    } else if(response.data?.register.user) {
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
                            name="email"
                            label="Email"
                            placeholder="Email"
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
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withApollo({ssr: false})(Register);