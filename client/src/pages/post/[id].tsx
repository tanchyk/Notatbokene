import React from "react";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../utils/createUrqlClient";
import {Layout} from "../../components/Layout";
import {Flex, Heading, Stack, Text} from '@chakra-ui/react';
import {useGetPost} from "../../utils/useGetPost";
import {PostButtons} from "../../components/PostButtons";

const Post: React.FC<{}> = ({}) => {
    const [{data, fetching}] = useGetPost();

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

export default withUrqlClient(createUrqlClient, {ssr: true})(Post);