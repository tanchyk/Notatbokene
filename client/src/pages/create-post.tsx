import React from "react";
import {Form, Formik} from "formik";
import {InputField} from "../components/InputField";
import {Button, Flex} from "@chakra-ui/react";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import {useCreatePostMutation} from "../generated/graphql";
import {useRouter} from "next/router";
import {Layout} from "../components/Layout";

const CreatePost: React.FC = ({}) => {
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();

    return (
        <Layout variant="small">
            <Formik
                initialValues={{
                    title: "",
                    text: ""
                }}
                onSubmit={async (values) => {
                    const {error} = await createPost({input: values});
                    if(error) {
                        await router.push('/login');
                    } else {
                        await router.push('/');
                    }
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField
                            name="title"
                            label="Title"
                            placeholder="Title"
                        />
                        <InputField
                            name="text"
                            label="Text"
                            placeholder="Text"
                            textarea={true}
                        />
                        <Flex direction="row" alignItems="center" mt={4}>
                            <Button
                                mr={2}
                                type="submit"
                                isLoading={isSubmitting}
                            >
                                Create Post
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost);