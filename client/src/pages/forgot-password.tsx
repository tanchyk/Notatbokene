import React from "react";
import {Form, Formik} from "formik";
import {InputField} from "../components/InputField";
import {Button, Flex} from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {useRouter} from "next/router";
import {useForgotPasswordMutation} from "../generated/graphql";
import {withApollo} from "../utils/withApollo";

const ForgotPassword: React.FC = ({}) => {
    const router = useRouter();
    const [forgotPassword] = useForgotPasswordMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{
                    email: ""
                }}
                onSubmit={async (values) => {
                    await forgotPassword({variables: values});
                    await router.push('/');
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField
                            name="email"
                            label="Email"
                            placeholder="Email"
                        />
                        <Flex direction="row" alignItems="center" mt={4}>
                            <Button
                                mr={2}
                                type="submit"
                                isLoading={isSubmitting}
                            >
                                Send Email
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withApollo({ssr: false})(ForgotPassword);