import React from "react";
import {usePostsQuery} from "../generated/graphql";
import {Box, Button, Flex, Heading, Link, Skeleton, Stack, Text} from "@chakra-ui/react";
import {Layout} from "../components/Layout";
import NextLink from "next/link";
import {UpvoteSection} from "../components/UpvoteSection";
import {PostButtons} from "../components/PostButtons";
import {withApollo} from "../utils/withApollo";

const Index: React.FC = () => {
    const {data, loading, fetchMore, variables} = usePostsQuery({
        variables: {
            limit: 10,
            cursor: null
        },
        notifyOnNetworkStatusChange: true
    });

    const loadMore = () => {
        return fetchMore({
            variables: {
                limit: variables?.limit,
                cursor: data?.posts.posts[data?.posts.posts.length - 1].createdAt
            }
        });
    }

    if (!loading && !data) {
        return <Heading>404</Heading>
    }

    return (
        <Layout>
            <Flex mt={8} mb={8} alignItems="center">
                <Heading>Community Posts</Heading>
                <NextLink href="/create-post">
                    <Link ml="auto">Create Post</Link>
                </NextLink>
            </Flex>
            {
                data && !loading ? (
                    <Stack spacing={8} my={8}>
                        {
                            data.posts.posts.map((post) => !post ? null : (
                                <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                                    <UpvoteSection post={post} />
                                    <Box>
                                        <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                                            <Link>
                                                <Heading fontSize="xl">{post.title}</Heading>
                                            </Link>
                                        </NextLink>
                                        <Text mt={2}>Posted by {post.creator.username}</Text>
                                        <Text mt={4}>{post.textSnippet}</Text>
                                    </Box>
                                    <PostButtons postId={post.id} creatorId={post.creator.id}/>
                                </Flex>
                            ))
                        }
                    </Stack>
                ) : (
                    <Stack my={8}>
                        <Skeleton height="60px"/>
                        <Skeleton height="60px"/>
                        <Skeleton height="60px"/>
                        <Skeleton height="60px"/>
                        <Skeleton height="60px"/>
                    </Stack>
                )
            }
            {
                data && data.posts.hasMore ? (
                    <Button isLoading={loading} my={8} onClick={loadMore}>
                        Load More
                    </Button>
                ) : (
                    <Heading my={8}>No more posts</Heading>
                )
            }
        </Layout>
    )
}

export default withApollo({ssr: true})(Index);
