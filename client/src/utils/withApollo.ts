import { withApollo as createWithApollo } from "next-apollo";
import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {PaginatedPosts} from "../generated/graphql";

const client = (ctx: any) => new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
        uri: `${process.env.NEXT_PUBLIC_API_URL}`,
        credentials: 'include',
        headers: {
            cookie: typeof window === 'undefined' ? ctx.req?.headers.cookie : null,
        },
    }),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    posts: {
                        keyArgs: [],
                        merge(
                            existing: PaginatedPosts | undefined,
                            incoming: PaginatedPosts
                        ): PaginatedPosts {
                            return {
                                ...incoming,
                                posts: [...(existing?.posts || []), ...incoming.posts]
                            }
                        }
                    }
                }
            }
        }
    })
})

export const withApollo = createWithApollo((ctx) => {
    if (ctx) {
        console.log(ctx.req?.headers);
    }
    return client(ctx)
});