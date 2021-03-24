import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Post} from "../entities/Post";
import {getRepository} from "typeorm";
import {PostInput} from "./InputTypes";
import {MyContext} from "../types";
import {isAuth} from "../middleware/isAuth";

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
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('input') input: PostInput,
        @Ctx() {req}: MyContext
    ): Promise<Post> {

        const post = new Post();
        post.creatorId = req.session.userId;
        post.title = input.title;
        post.text = input.text;

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