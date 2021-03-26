import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware
} from "type-graphql";
import {Post} from "../entities/Post";
import {getRepository} from "typeorm";
import {PostInput} from "./InputTypes";
import {MyContext} from "../types";
import {isAuth} from "../middleware/isAuth";

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];
    @Field()
    hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(
        @Root() root: Post
    ) {
        let trimmedString = root.text.substr(0, 75);
        if(root.text.length > trimmedString.length){
            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
        }
        return trimmedString + ' ...';
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg(
            'cursor',
            () => Date,
            {nullable: true}
            ) cursor: Date | null
    ): Promise<PaginatedPosts> {
        const finalLimit = Math.min(50, limit);
        const query = getRepository(Post).createQueryBuilder("post")
            .orderBy('post.createdAt', "DESC")
            .take(finalLimit + 1)
        if(cursor) {
            query.where('post.createdAt < :cursor', {cursor})
        }

        const posts = await query.getMany()

        return {
            hasMore: posts.length === limit + 1,
            posts: posts.slice(0, limit)
        }
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