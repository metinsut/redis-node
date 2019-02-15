import multer from 'multer';
import jimp from 'jimp';
import { User } from '../../models/user';

const getUserById = (req, res) => {
   User.findOne({ _id: req.params.userId }).select('-password -role -followers -following')
      .then((data) => {
         res.json({
            error: null,
            success: {
               user: data,
            },
         });
      })
      .catch((err) => {
         res.json({
            error: {
               message: 'Your user id that you want is incorrect or not exist.',
               code: err,
            },
            success: null,
         });
      });
};

const getUserAccount = (req, res) => {
   if (req.user._id === req.params.userId) {
      User.findOne({ _id: req.params.userId }).select('-password')
         .then((data) => {
            res.json({
               error: null,
               success: {
                  user: data,
               },
            });
         })
         .catch((err) => {
            res.json({
               error: {
                  message: 'You can\'t access this account.',
                  code: err,
               },
               success: null,
            });
         });
   } else {
      res.json({
         error: {
            message: 'You can\'t see this user',
         },
         success: null,
      });
   }
};

const getUserUnFollow = (req, res) => {
   const { following } = req.user;
   following.push(req.user._id);
   User.find({ _id: { $nin: following } }).select('_id name avatar')
      .then((data) => {
         res.json({
            error: null,
            success: {
               feeds: data,
            },
         });
      })
      .catch((err) => {
         res.json({
            error: {
               message: 'error',
               error: err,
            },
            success: null,
         });
      });
};

const avatarUploadOptions = {
   storage: multer.memoryStorage(),
   limits: {
      fileSize: 1024 * 1024 * 1,
   },
   fileFilter: (req, file, next) => {
      if (file.mimetype.startsWith('image/')) {
         next(null, true);
      } else {
         next(null, false);
      }
   },
};

const uploadAvatar = multer(avatarUploadOptions).single('avatar');

const resizeAvatar = async (req, res, next) => {
   if (!req.file) {
      return next();
   }
   const extension = req.file.mimetype.split('/')[1];
   req.body.avatar = `./static/uploads/avatars/${req.user._id}/${req.user.name}-${Date.now()}.${extension}`;
   const image = await jimp.read(req.file.buffer);
   await image.contain(250, 250);
   await image.write(`./${req.body.avatar}`);
   next();
};

const updateUser = async (req, res, next) => {
   req.body.updateAt = new Date().toISOString();
   if (req.params.userId === req.user._id.toString()) {
      User.findOneAndUpdate({ _id: req.user._id }, { $set: req.body }, { new: true, runValidators: true })
         .then((data) => {
            res.json({
               error: null,
               success: {
                  user: data,
               },
            });
         })
         .catch((err) => {
            res.json({
               error: {
                  message: err,
               },
               success: null,
            });
         });
   } else {
      res.json({
         error: {
            message: 'You can\'t update this user',
         },
         success: null,
      });
   }

};

const getUsers = (req, res, next) => {
   User.find().select('_id name avatar')
      .then((data) => {
         res.json({
            error: null,
            success: {
               users: data,
            },
         });
      })
      .catch((err) => {
         res.json({
            error: {
               message: 'There is no user.',
               error: err,
            },
            success: null,
         });
      });
};

const deleteUser = (req, res) => {
   if (req.user._id === req.params.userId) {
      User.findByIdAndDelete({ _id: req.user._id })
         .then((data) => {
            res.json({
               error: null,
               success: {
                  user: data,
               },
            });
         })
         .catch((err) => {
            res.json({
               error: {
                  message: 'Error',
                  error: err,
               },
               success: null,
            });
         });
   } else {
      res.json({
         error: {
            message: 'You can\'t delete this account',
         },
         success: null,
      });
   }
};

const addFollowing = (req, res, next) => {
   const { followId } = req.body;
   User.findByIdAndUpdate({ _id: req.user._id }, { $addToSet: { following: followId } }, { new: true })
      .then((data) => {
         next();
      })
      .catch((err) => {
         res.json({
            error: {
               message: 'Error',
               error: err,
            },
            success: null,
         });
      });
};

const addFollower = (req, res) => {
   const { followId } = req.body;
   User.findByIdAndUpdate(
      { _id: followId },
      { $addToSet: { followers: req.user._id } },
      { new: true },
   )
      .then((data) => {
         res.json({
            error: null,
            success: {
               message: 'You have been succfuly following',
               status: true,
            },
         });
      })
      .catch((err) => {
         res.json({
            error: {
               message: 'Error',
               error: err,
            },
            success: null,
         });
      });
};

const deleteFollowing = (req, res, next) => {
   const { followId } = req.body;
   User.findByIdAndUpdate({ _id: req.user._id }, { $pull: { following: followId } })
      .then((data) => {
         next();
      })
      .catch((err) => {
         res.json({
            error: {
               message: 'Error',
               error: err,
            },
            success: null,
         });
      });
};

const deleteFollower = (req, res) => {
   const { followId } = req.body;
   User.findByIdAndUpdate(
      { _id: followId },
      { $pull: { followers: req.user._id } },
      { new: true },
   )
      .then((data) => {
         res.json({
            error: null,
            success: {
               message: 'You have been successfully unfollowed',
               status: true,
            },
         });
      })
      .catch((err) => {
         res.json({
            error: {
               message: 'Error',
               error: err,
            },
            success: null,
         });
      });
};

export {
   getUserById,
   getUserAccount,
   uploadAvatar,
   resizeAvatar,
   updateUser,
   getUsers,
   deleteUser,
   addFollowing,
   addFollower,
   deleteFollowing,
   deleteFollower,
   getUserUnFollow,
};
