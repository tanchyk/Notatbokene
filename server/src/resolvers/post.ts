import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {Post} from "../entities/Post";
import {getRepository} from "typeorm";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(): Promise<Post[]> {
        const postRepository = getRepository(Post);
        return postRepository.find();
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id') id: number
    ): Promise<Post | undefined> {
        const postRepository = getRepository(Post);
        return postRepository.findOne({ where: {id}});
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string
    ): Promise<Post> {
        const post = new Post();
        post.title = title;

        const postRepository = getRepository(Post);
        await postRepository.save(post);

        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id') id: number,
        @Arg(
            'title',
            () => String,
            {nullable: true}
            ) title: string
    ): Promise<Post | undefined> {
        const postRepository = getRepository(Post);
        const post = await postRepository.findOne({ where: {id}});
        if(!post) {
            return undefined;
        }
        if(typeof title !== "undefined") {
            post.title = title;
            await postRepository.save(post);
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number
    ): Promise<boolean> {
        try {
            const postRepository = getRepository(Post);
            await postRepository.delete({id});
        } catch (e) {
            return false
        }
        return true;
    }
}