import React from "react";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../utils/createUrqlClient";
import {useRouter} from "next/router";
import {usePostQuery} from "../../generated/graphql";
import {Layout} from "../../components/Layout";
import {Text, Heading, Stack} from '@chakra-ui/react';

const Post: React.FC<{}> = ({}) => {
    const router = useRouter();
    const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
    const [{data, fetching}] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId
        }
    })

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