import { Button, Flex, Heading, Text , Stack} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import {useLogoutMutation, useMeQuery} from "../generated/graphql";
import {Wrapper} from "./Wrapper";

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{data, fetching}] = useMeQuery();
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()
    let body = null;

    if(fetching) {

    } else if(!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Button variant="outline" mr={2}>Login</Button>
                </NextLink>
                <NextLink href="/register">
                    <Button>Register</Button>
                </NextLink>
            </>
        );
    } else {
        body = (
            <>
                <Heading size="sm" mr={2}>{data.me.username}</Heading>
                <Button
                    variant="outline"
                    onClick={() => logout()}
                    isLoading={logoutFetching}
                >
                    Logout
                </Button>
            </>
        );
    }

    return (
        <Flex zIndex={1} position="sticky" top={0} bg="gray.300" p={4}>
            <Wrapper variant='regular'>
                <Flex>
                    <NextLink href="/">
                        <Stack spacing={-1} _hover={{cursor: "pointer"}}>
                            <Heading>Notatboken</Heading>
                            <Text>community</Text>
                        </Stack>
                    </NextLink>
                    <Flex ml="auto" alignItems="center">
                        {body}
                    </Flex>
                </Flex>
            </Wrapper>
        </Flex>
    );
}