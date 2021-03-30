import React from "react";
import {Layout} from "../../components/Layout";
import {Flex, Heading, Stack, Text} from '@chakra-ui/react';
import {useGetPost} from "../../utils/useGetPost";
import {PostButtons} from "../../components/PostButtons";
import {withApollo} from "../../utils/withApollo";

const Post: React.FC<{}> = ({}) => {
    const {data, loading} = useGetPost();

    if(loading) {
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
            <Flex my={8}>
                <Stack spacing={4}>
                    <Heading>{data.post.title}</Heading>
                    <Text>{data.post.text}</Text>
                </Stack>
                <PostButtons postId={data.post.id} creatorId={data.post.creator.id} />
            </Flex>
        </Layout>
    );
}

export default withApollo({ssr: true})(Post);