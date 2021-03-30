import React from "react";
import {IconButton, Link, Stack} from "@chakra-ui/react";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import NextLink from "next/link";
import {useDeletePostMutation, useMeQuery} from "../generated/graphql";

interface PostButtonsProps {
    postId: number;
    creatorId: number;
}

export const PostButtons: React.FC<PostButtonsProps> = ({postId, creatorId}) => {
    const [deletePost] = useDeletePostMutation();
    const {data} = useMeQuery();

    if(!data?.me || data.me.id !== creatorId) {
        return null;
    }

    return (
        <Stack spacing={2} ml="auto">
            <IconButton
                size="sm"
                aria-label="Delete Post"
                icon={<DeleteIcon/>}
                onClick={() => {
                    deletePost({
                        variables: {id: postId},
                        update: (cache) => {
                            cache.evict({id: 'Post:' + postId});
                        }
                    })
                }}
            />
            <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
                <IconButton
                    as={Link}
                    size="sm"
                    aria-label="Edit Post"
                    icon={<EditIcon/>}
                />
            </NextLink>
        </Stack>
    );
}