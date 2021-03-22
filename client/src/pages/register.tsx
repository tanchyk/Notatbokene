import React from "react";
import {Formik, Form} from 'formik';
import {Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";

interface RegisterProps {

}

const Register: React.FC<RegisterProps> = ({}) => {
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{
                    username: "",
                    password: ""
                }}
                onSubmit={(values) => {
                    console.log(values);
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