export interface CreateCommentReq {
    user_id: string;

    post_id: string;

    content: string;
}

export interface DeletedCommentReq {
    user_id: string;

    id: string;
}
