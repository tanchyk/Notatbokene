import React from "react";
import {Formik, Form} from 'formik';
import {Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";
import {useMutation} from "urql";
import {useRegisterMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";

interface RegisterProps {

}

const Register: React.FC<RegisterProps> = ({}) => {
    const router = useRouter();
    const [{},register] = useRegisterMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{
                    username: "",
                    password: ""
                }}
                onSubmit={async (values, {setErrors}) => {
                    const response = await register(values);
                    console.log(response)
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

export default Register;