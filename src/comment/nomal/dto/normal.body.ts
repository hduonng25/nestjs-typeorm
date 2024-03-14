export interface CreateNormalReq {
    user_id: string;

    post_id: string;

    content: string;
}

export interface DeletedNormalReq {
    user_id: string;

    id: string;
}
