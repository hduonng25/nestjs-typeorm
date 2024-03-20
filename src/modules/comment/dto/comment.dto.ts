import { PostEntity } from '/modules/post/entity/post.entity';
import { ReplyEntity } from '/modules/reply/entity/reply.entity';
import { UserEntity } from '/modules/user/entity/user.entity';

export class CommentDTO {
    id: string;

    content: string;

    reply_comment: ReplyEntity[];

    user: UserEntity;

    post: PostEntity;
}
