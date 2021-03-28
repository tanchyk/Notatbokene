import DataLoader from "dataloader";
import {User} from "../entities/User";
import {Upvote} from "../entities/Upvote";

export const createUserLoader = () => new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach(user => {
        userIdToUser[user.id] = user;
    });

    return userIds.map((userId) => userIdToUser[userId]);
});

export const createUpvoteLoader = () => new DataLoader<{
    postId: number,
    userId: number
}, Upvote | null>(
    async (keys) => {
        const upvotes = await Upvote.findByIds(keys as any);

        const upvoteIdsToUpvote: Record<string, Upvote> = {};
        upvotes.forEach((upvote) => {
            upvoteIdsToUpvote[`${upvote.userId}|${upvote.postId}`] = upvote;
        })

        return keys.map((key) => upvoteIdsToUpvote[`${key.userId}|${key.postId}`])
    }
)