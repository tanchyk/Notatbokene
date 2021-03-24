import React, {useState} from "react";
import {NextPage} from "next";
import {Form, Formik} from "formik";
import {toErrorMap} from "../../utils/toErrorMap";
import {InputField} from "../../components/InputField";
import {Alert, AlertIcon, Button, Link, Stack} from "@chakra-ui/react";
import {Wrapper} from "../../components/Wrapper";
import {useChangePasswordMutation} from "../../generated/graphql";
import {useRouter} from "next/router";
import {createUrqlClient} from "../../utils/createUrqlClient";
import {NextComponentType, withUrqlClient} from "next-urql";
import NextLink from "next/link";

interface ChangePasswordProps {
    token: string;
}

const ChangePassword: NextPage<ChangePasswordProps> = ({token}) => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState<string>('');

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{
                    newPassword: ""
                }}
                onSubmit={async (values, {setErrors}) => {
                    const response = await changePassword({token, newPassword: values.newPassword});

                    if(response.data?.changePassword?.errors) {
                        const errors = toErrorMap(response.data.changePassword.errors);
                        if('token' in errors) {
                            setTokenError(errors.token);
                        }
                        return setErrors(errors);
                    } else if(response.data?.changePassword.user) {
                        return router.push('/');
                    }
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            label="New Password"
                            placeholder="New Password"
                            type="password"
                        />
                        {
                            tokenError ? (
                                <Stack spacing={4}>
                                    <Alert status="error">
                                        <AlertIcon />
                                        {tokenError}
                                    </Alert>
                                    <NextLink href="/forgot-password">
                                        <Link>
                                            Get token
                                        </Link>
                                    </NextLink>
                                </Stack>
                            ) : null
                        }
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Change
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string
    }
}

// @ts-ignore
export default withUrqlClient(createUrqlClient)(ChangePassword as NextComponentType);