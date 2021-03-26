import {dedupExchange, fetchExchange} from "urql";
import {cacheExchange} from "@urql/exchange-graphcache";
import {LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation} from "../generated/graphql";
import {betterUpdateQuery} from "./betterUpdateQuery";
import {cursorPagination} from "./cursorPagination";

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include' as const
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
})