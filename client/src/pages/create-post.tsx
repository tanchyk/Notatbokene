import React from "react";
import {Form, Formik} from "formik";
import {InputField} from "../components/InputField";
import {Button, Flex} from "@chakra-ui/react";
import {useCreatePostMutation} from "../generated/graphql";
import {useRouter} from "next/router";
import {Layout} from "../components/Layout";
import {withApollo} from "../utils/withApollo";

const CreatePost: React.FC = ({}) => {
    const router = useRouter();
    const [createPost] = useCreatePostMutation();

    return (
        <Layout variant="small">
            <Formik
                initialValues={{
                    title: "",
                    text: ""
                }}
                onSubmit={async (values) => {
                    const {errors} = await createPost({
                        variables: {input: values},
                        update: cache => {
                            cache.evict({fieldName: "posts"});
                        }
                    });
                    if(errors) {
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

export default withApollo({ssr: false})(CreatePost);