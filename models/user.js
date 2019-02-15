import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         trim: true,
         lowercase: true,
         unique: true,
         required: 'Email is required',
      },
      name: {
         type: String,
         trim: true,
         unique: true,
         minlength: 4,
         maxlength: 10,
         required: 'Name is required',
      },
      password: {
         type: String,
         trim: true,
         minlength: 4,
         maxlength: 20,
         required: 'Password is required',
      },
      avatar: {
         type: String,
         required: 'Avatar image is required',
         default: '/static/images/profile-image.jpg',
      },
      about: {
         type: String,
         trim: true,
      },
      role: {
         role_id: {
            type: Number,
            minlength: 1,
            maxlength: 5,
            default: 1,
         },
         role_name: {
            type: String,
            default: 'user',
         },
      },
      isActive: {
         type: Boolean,
         default: false,
         required: true,
      },
      following: [{ type: ObjectId, ref: 'user' }],
      followers: [{ type: ObjectId, ref: 'user' }],
   },
   { timestamps: true },
);

const autoPopulateFollowingAndFollowers = function(next) {
   this.populate('following', '_id name avatar');
   this.populate('followers', '_id name avatar');
   next();
};

userSchema.pre('findOne', autoPopulateFollowingAndFollowers);

userSchema.pre('save', function (next) {
   bcrypt.genSalt(10, (err, salt) => {
      if (err) {
         return next(err);
      }
      bcrypt.hash(this.password, salt, (error, hash) => {
         if (error) {
            return next(error);
         }
         this.password = hash;
         next();
      });
   });
});

userSchema.methods.comparePassword = (
   candidatePassword,
   callback,
) => {
   bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
         return callback(err);
      }
      callback(null, isMatch);
   });
};

export const User = mongoose.model('user', userSchema);
