import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentPostDto } from './dto/comment-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { Post as PostModel } from './schemas/post.schema';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createPostDto: CreatePostDto,@Request() req) {
        createPostDto.name = req.user.name;
        createPostDto.creator = req.user.sub;
        return this.postsService.createPost(createPostDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param() params) {
        const post_id = params.id
        return this.postsService.delete(post_id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Body() createPostDto: CreatePostDto,@Param() params) {
        const post_id = params.id
        return this.postsService.update(createPostDto, post_id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/likePost')
    likePost(@Param() params,@Request() req) {
        const user_id = req.user.sub;
        const post_id = params.id;
        return this.postsService.likePost(user_id, post_id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/commentPost')
    commentPost(@Param() params,@Body() commentPostDto: CommentPostDto) {
        const { comment } = commentPostDto;
        const post_id = params.id;
        return this.postsService.commentPost(comment, post_id);
    }
    
    @Get('/search')
    async serach(@Request() req): Promise<PostModel[]> {
        const { searchQuery, tags } = req.query;
        return this.postsService.search(searchQuery, tags);
    }

    @Get(':id')
    async findOne(@Param() params): Promise<PostModel> {
        return this.postsService.findOne(params.id);
    }

    @Get()
    async findAll(@Request() req): Promise<PostModel[]> {
        const { page } = req.query;
        return this.postsService.findAll(page);
    }
}
