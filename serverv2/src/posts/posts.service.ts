import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly postModel: Model<PostDocument>
    ) { }

    async findAll(): Promise<Post[]> {
        return this.postModel.find().exec();
    }
}
