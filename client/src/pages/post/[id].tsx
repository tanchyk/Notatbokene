import React from "react";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../utils/createUrqlClient";
import {Layout} from "../../components/Layout";
import {Heading, Stack, Text} from '@chakra-ui/react';
import {useGetPost} from "../../utils/useGetPost";

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
            <Stack spacing={4}>
                <Heading>{data.post.title}</Heading>
                <Text>{data.post.text}</Text>
            </Stack>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post);