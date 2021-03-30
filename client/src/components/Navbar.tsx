import {Button, Flex, Heading, Stack, Text} from "@chakra-ui/react";
import React, {useEffect} from "react";
import NextLink from "next/link";
import {useLogoutMutation, useMeQuery} from "../generated/graphql";
import {Wrapper} from "./Wrapper";
import {useApolloClient} from "@apollo/client";

export const Navbar: React.FC = ({}) => {
    const {data, loading} = useMeQuery();
    const [logout, {loading: logoutFetching}] = useLogoutMutation();
    const apolloClient = useApolloClient();
    let body = null;

    useEffect(() => {
        console.log(data);
    }, [data])

    if(loading) {

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
                    onClick={async () => {
                        await logout();
                        await apolloClient.resetStore();
                    }}
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