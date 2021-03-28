import React from "react";
import {createUrqlClient} from "../../../utils/createUrqlClient";
import {withUrqlClient} from "next-urql";
import {Layout} from "../../../components/Layout";
import {Form, Formik} from "formik";
import {InputField} from "../../../components/InputField";
import {Button, Flex, Heading} from "@chakra-ui/react";
import {useGetPost} from "../../../utils/useGetPost";
import {useUpdatePostMutation} from "../../../generated/graphql";
import {useRouter} from "next/router";

const EditPost: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [{data, fetching}] = useGetPost();
    const [,updatePost] = useUpdatePostMutation();

    if(fetching) {
        return (
            <Layout>
                <Heading>...loading</Heading>
            </Layout>
        )
    }

    if(!data?.post) {
        return (
            <Layout>
                <Heading>Could not find a post</Heading>
            </Layout>
        )
    }

    return (
        <Layout>
            <Formik
                initialValues={{
                    title: data.post.title,
                    text: data.post.text
                }}
                onSubmit={async (values) => {
                    if(data?.post) {
                        await updatePost({id: data.post.id, ...values});
                        await router.back();
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
                                Update Post
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(EditPost);