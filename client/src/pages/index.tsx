import React from "react";
import {Navbar} from "../components/Navbar";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import {usePostsQuery} from "../generated/graphql";

const Index: React.FC = () => {
    const [{data}] = usePostsQuery();
    return (
        <>
            <Navbar />
            {!data ? null : data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
        </>
    )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
