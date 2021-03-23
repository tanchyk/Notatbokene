import { Button, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import {useMeQuery} from "../generated/graphql";

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{data, fetching}] = useMeQuery();
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
                <Button variant="outline">Logout</Button>
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