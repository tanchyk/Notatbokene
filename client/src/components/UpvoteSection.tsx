import React, {useState} from "react";
import {IconButton, Stack, Heading} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {PostSnippetFragment, useVoteMutation, VoteMutation} from "../generated/graphql";
import {ApolloCache, gql} from "@apollo/client";

interface UpvoteSectionProps {
    post: PostSnippetFragment;
}

const updateAfterVote = (value: number, cache: ApolloCache<VoteMutation>, postId: number) => {
    const data = cache.readFragment<{
        id: number,
        points: number,
        voteStatus: number | null
    }>({
        id: "Post:" + postId,
        fragment: gql(`
           fragment _ on Post {
             id
             points
             voteStatus
           }
        `)
    })

    if (data) {
        if (data.voteStatus === value) {
            return;
        }
        const newPoints = data.points + (!data.voteStatus ? 1 : 2) * value;
        cache.writeFragment({
            id: "Post:" + postId,
            fragment: gql(`
               fragment __ on Post {
                 points
                 voteStatus
               }
            `),
            data: {points: newPoints, voteStatus: value}
        })
    }
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = useState<"upvote-loading" | "downvote-loading" | 'not-loading'>("not-loading");
    const [vote] = useVoteMutation();

    return (
        <Stack mr={4} spacing={2} justifyContent="center" alignItems="center">
            <IconButton
                icon={<ChevronUpIcon />}
                aria-label="Up"
                onClick={async () => {
                    if(post.voteStatus === 1) {
                        return;
                    }
                    setLoadingState('upvote-loading');
                    await vote({
                        variables: {
                            value: 1,
                            postId: post.id
                        },
                        update: cache => updateAfterVote(1, cache, post.id)
                    })
                    setLoadingState('not-loading');
                }}
                colorScheme={post.voteStatus === 1 ? "green" : undefined}
                isLoading={loadingState === 'upvote-loading'}
            />
            <Heading size="md">{post.points}</Heading>
            <IconButton
                icon={<ChevronDownIcon />}
                aria-label="Down"
                onClick={async () => {
                    if(post.voteStatus === -1) {
                        return;
                    }
                    setLoadingState('downvote-loading');
                    await vote({
                        variables: {
                            value: -1,
                            postId: post.id
                        },
                        update: cache => updateAfterVote(-1, cache, post.id)
                    })
                    setLoadingState('not-loading');
                }}
                colorScheme={post.voteStatus === -1 ? "red" : undefined}
                isLoading={loadingState === 'downvote-loading'}
            />
        </Stack>
    );
}