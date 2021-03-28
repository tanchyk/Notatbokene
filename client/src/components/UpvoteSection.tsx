import React, {useState} from "react";
import {IconButton, Stack, Heading} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {PostSnippetFragment, useVoteMutation} from "../generated/graphql";

interface UpvoteSectionProps {
    post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = useState<"upvote-loading" | "downvote-loading" | 'not-loading'>("not-loading");
    const [, vote] = useVoteMutation();

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
                        value: 1,
                        postId: post.id
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
                        value: -1,
                        postId: post.id
                    })
                    setLoadingState('not-loading');
                }}
                colorScheme={post.voteStatus === -1 ? "red" : undefined}
                isLoading={loadingState === 'downvote-loading'}
            />
        </Stack>
    );
}