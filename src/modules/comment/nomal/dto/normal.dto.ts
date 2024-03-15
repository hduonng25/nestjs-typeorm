import { ReplyEntity } from '../../reply/entity/reply.entity';
import { UserEntity } from '../../../user/entity/user.entity';
import { PostEntity } from '../../../post/entity/post.entity';

export class NormalDto {
    id: string;

    content: string;

    reply_comment: ReplyEntity[];

    user: UserEntity;

    post: PostEntity;
}
