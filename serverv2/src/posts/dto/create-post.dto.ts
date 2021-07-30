import { IsEmpty } from "class-validator";

export class CreatePostDto {
    
    name: string;

    @IsEmpty()
    title: string;

    @IsEmpty()
    message: string;

    @IsEmpty()
    selectedFile: string;
    
    creator: string;
    likes: string[];
    tags: string[];
    comments: string[];
}