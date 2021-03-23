import { Button, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import {useLogoutMutation, useMeQuery} from "../generated/graphql";
import {isServer} from "../utils/isServer";

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{data, fetching}] = useMeQuery({
        pause: isServer()
    });
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
        <Flex bg="gray.300" p={4}>
            <Flex ml="auto" alignItems="center">
                {body}
            </Flex>
        </Flex>
    );
}