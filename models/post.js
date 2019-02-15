import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: 'Post title is required',
      },
      content: {
         type: String,
         required: 'Post content is required',
      },
      image: {
         type: String,
      },
      likes: [{ type: ObjectId, ref: 'user' }],
      comments: [
         {
            text: String,
            createdAt: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: 'user' },
         },
      ],
      postedBy: { type: ObjectId, ref: 'user' },
      createdAt: {
         type: Date,
         default: Date.now,
      },
   },
   { autoIndex: false },
);

const autoPopulatePostedBy = function (next) {
   this.populate('postedBy', '_id name avatar');
   this.populate('comments.postedBy', '_id name avatar');
   next();
};

postSchema
   .pre('findOne', autoPopulatePostedBy)
   .pre('find', autoPopulatePostedBy);

postSchema.index({ postedBy: 1, createdAt: 1 });

export const Post = mongoose.model('post', postSchema);
