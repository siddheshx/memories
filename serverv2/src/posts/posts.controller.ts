import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { Post as PostModel } from './schemas/post.schema';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    create(@Body() createPostDto: CreatePostDto) {
        console.log(createPostDto);
    }


    @Get()
    async findAll(): Promise<PostModel[]> {
        return this.postsService.findAll();
    }
}
