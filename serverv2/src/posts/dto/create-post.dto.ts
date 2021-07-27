
export class CreatePostDto {
    name: string;
    title: string;
    message: string;
    selectedFile: string;
    creator: string;
    likes: string[];
    tags: string[];
    comments: string[];
}