import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly postModel: Model<PostDocument>
    ) { }

    async createPost(postData: CreatePostDto): Promise<{ _id: string }> {

        if (postData.title == '' || postData.message == '' || postData.selectedFile == '' || postData.creator == '') {
            throw new HttpException('Please fill required data.', HttpStatus.BAD_REQUEST);
        }

        const post = await this.postModel.create(postData);

        return {
            _id: post._id
        }
    }

    async findOne(post_id: string): Promise<Post> {
        return await this.postModel.findById(post_id);
    }

    async search(searchQuery: string, tags: string): Promise<Post[]> {
        const title = new RegExp(searchQuery, 'i');
        return await this.postModel.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
    }

    async findAll(page: number): Promise<any> {
        const LIMIT = 8;
        const startIndex = (page - 1) * LIMIT;
        const total = await this.postModel.countDocuments();

        const posts = await this.postModel.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        return { data: posts, currentPage: page, numberOfPages: Math.ceil(total / LIMIT) };
    }

    async update(postData: CreatePostDto, id: string): Promise<Post> {
        return await this.postModel.findByIdAndUpdate(id, postData, { new: true });
    }

    async delete(id: string): Promise<{ message: string }> {

        await this.postModel.findByIdAndRemove(id);

        return {
            message: "Post deleted successfully."
        }
    }

    async likePost(user_id: string, id: string): Promise<Post> {

        const post = await this.postModel.findById(id);

        const index = post.likes.findIndex((id) => id === String(user_id));

        if (index === -1) {
            post.likes.push(user_id);
        } else {
            post.likes = post.likes.filter((id) => id !== String(user_id));
        }

        return await this.postModel.findByIdAndUpdate(id, post, { new: true });
    }

    async commentPost(comment: string, id: string): Promise<Post> {

        const post = await this.postModel.findById(id);

        post.comments.push(comment);

        return await this.postModel.findByIdAndUpdate(id, post, { new: true });
    }


}
