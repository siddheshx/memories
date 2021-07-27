export type TPost = {
    _id?: string;
    name?: string;
    creator?: string;
    title: string;
    message: string;
    tags?: string[];
    selectedFile?: string,
    likes?: string[],
    comments?: string[],
    createdAt?: string
}

export type TAuthDataLocal = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confrimPassword: string
}

export type TAuthDataDb = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confrimPassword: string
}

export type TPostsSearch = {
    search?: string;
    tags?: string;
}