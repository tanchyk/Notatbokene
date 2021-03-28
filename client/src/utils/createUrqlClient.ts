import {dedupExchange, fetchExchange} from "urql";
import {cacheExchange} from "@urql/exchange-graphcache";
import {
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    RegisterMutation,
    VoteMutationVariables
} from "../generated/graphql";
import {betterUpdateQuery} from "./betterUpdateQuery";
import {cursorPagination} from "./cursorPagination";
import { gql } from '@urql/core';
import {isServer} from "./isServer";

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = '';
    if(isServer()) {
        cookie = ctx.req.headers.cookie;
    }

    return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include' as const,
        headers: cookie ? {
            cookie
        } : undefined
    },
    exchanges: [dedupExchange, cacheExchange({
        keys: {
            PaginatedPosts: () => null
        },
        resolvers: {
          Query: {
              posts: cursorPagination()
          }
        },
        updates: {
            Mutation: {
                vote: (_result, args , cache) => {
                    const {postId, value} = args as VoteMutationVariables;
                    const data = cache.readFragment(
                        gql(`
                            fragment _ on Post {
                                id
                                points
                                voteStatus
                            }
                        `), {id: postId}
                    )
                    if(data) {
                        if(data.voteStatus === value) {
                            return;
                        }
                        const newPoints = data.points + (!data.voteStatus ? 1 : 2) * value;
                        cache.writeFragment(
                            gql(`
                            fragment __ on Post {
                                points
                                voteStatus
                            }
                        `),
                            {id: postId, points: newPoints, voteStatus: value}
                        )
                    }
                },
                createPost: (_result, _ , cache) => {
                    const allFields = cache.inspectFields("Query");
                    const fieldInfos = allFields.filter(
                        (info) => info.fieldName === "posts"
                    );
                    fieldInfos.forEach((fi) => {
                        cache.invalidate('Query', 'posts', fi.arguments || {});
                    });
                },
                logout: (_result, _ , cache) => {
                    betterUpdateQuery<LogoutMutation, MeQuery>(
                        cache,
                        {query: MeDocument},
                        _result,
                        () => ({me: null})
                    )
                },
                login: (_result, _ , cache) => {
                    betterUpdateQuery<LoginMutation, MeQuery>(
                        cache,
                        {query: MeDocument},
                        _result,
                        (result, query) => {
                            if(result.login.errors) {
                                return query;
                            } else {
                                return {
                                    me: result.login.user,
                                };
                            }
                        }
                    )
                },

                register: (_result, _ , cache) => {
                    betterUpdateQuery<RegisterMutation, MeQuery>(
                        cache,
                        {query: MeDocument},
                        _result,
                        (result, query) => {
                            if(result.register.errors) {
                                return query;
                            } else {
                                return {
                                    me: result.register.user,
                                };
                            }
                        }
                    )
                }
            }
        }
    }), ssrExchange, fetchExchange]
}}