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
import {getConnection, getRepository} from "typeorm";
import {PostInput} from "./InputTypes";
import {MyContext} from "../types";
import {isAuth} from "../middleware/isAuth";
import {Upvote} from "../entities/Upvote";

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

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() {req}: MyContext
    ) {
        const realValue = value !== -1 ? 1 : -1;
        const {userId} = req.session;

        const upvote = await Upvote.findOne({where: {postId, userId}});

        if(upvote && upvote.value !== realValue) {
            await getConnection().transaction(async tm => {
                await tm.query(`
                    update upvote
                    set value = ${realValue}
                    where "postId" = ${postId} and "userId" = ${userId}
                `);

                await tm.query(`
                    update post
                    set points = points + ${2 * realValue}
                    where id = ${postId};
                `);
            });
        } else if(!upvote) {
            await getConnection().transaction(async tm => {
                await tm.query(`
                    insert into upvote ("userId", "postId", value)
                    values (${userId}, ${postId}, ${realValue});
                `);

                await tm.query(`
                    update post
                    set points = points + ${realValue}
                    where id = ${postId};
                `);
            });
        }

        return true;
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg(
            'cursor',
            () => Date,
            {nullable: true}
            ) cursor: Date | null,
        @Ctx() {req}: MyContext
    ): Promise<PaginatedPosts> {
        const finalLimit = Math.min(50, limit);
        const replacements: any[] = [finalLimit + 1];

        if(req.session.userId) {
            replacements.push(req.session.userId);
        }

        let cursorIndex = 3
        if(cursor) {
            replacements.push(new Date(cursor));
            cursorIndex = replacements.length;
        }
        console.log(replacements)
        const posts = await getConnection().query(`
            select p.*,
            json_build_object(
                'id', u.id,
                'username', u.username,
                'email', u.email,
                'createdAt', u."createdAt",
                'updatedAt', u."updatedAt"
            ) creator,
            ${
            req.session.userId
                ? '(select value from upvote where "userId" = $2 and "postId" = p.id) "voteStatus"'
                : 'null as "voteStatus"'
            }
            from post p
            inner join public.user u on u.id = p."creatorId"
            ${cursor ? `where p."createdAt" < $${cursorIndex}` : ""}
            order by p."createdAt" DESC
            limit $1
        `, replacements);

        return {
            hasMore: posts.length === limit + 1,
            posts: posts.slice(0, limit)
        }
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id', () => Int) id: number
    ): Promise<Post | undefined> {
        const postRepository = getRepository(Post);
        return postRepository.findOne({relations: ['creator'], where: {id}});
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
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() {req}: MyContext
    ): Promise<boolean> {
        try {
            const postRepository = getRepository(Post);
            await postRepository.delete({id, creatorId: req.session.userId});
        } catch (e) {
            return false
        }
        return true;
    }
}