import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  message: string;

  @Prop()
  selectedFile: string;

  @Prop()
  creator: string;

  @Prop([String])
  likes: string[];

  @Prop([String])
  tags: string[];

  @Prop([String])
  comments: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);