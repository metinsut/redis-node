import express from 'express';
import Home from '../home/home';
import passportService from '../passport';
import { signUp, validateSignUp } from '../auth/signUp';
import { signIn } from '../auth/signIn';
import {
   getUserById,
   uploadAvatar,
   resizeAvatar,
   updateUser,
   getUsers,
   getUserAccount,
   deleteUser,
   addFollowing,
   addFollower,
   deleteFollower,
   deleteFollowing,
   getUserUnFollow,
} from '../user';
import { getPosts, getPostsByUser, uploadImage, resizeImage, addPost, deletePost } from '../post';
import signOut from '../auth/signOut';
import verifyUser from '../middleware/verifyUser';

const router = express.Router();
passportService();

/* Error handler for async / await functions */
const catchErrors = (fn) => {
   return (req, res, next) => {
      return fn(req, res, next).catch(next);
   };
};

router.get('/', Home);

router.post('/signup', validateSignUp, catchErrors(signUp));
router.post('/signin', signIn);
router.post('/signout', signOut);

router.post('/users', verifyUser, getUsers);
router.post('/users/getunfollow', verifyUser, getUserUnFollow);
router.post('/users/profile/:userId', verifyUser, getUserById);
router.post('/users/account/:userId', verifyUser, getUserAccount);
router.post('/users/update/:userId', verifyUser, uploadAvatar, catchErrors(resizeAvatar), catchErrors(updateUser));
router.post('/users/delete/:userId', verifyUser, deleteUser);
router.post('/users/follow', verifyUser, addFollowing, addFollower);
router.post('/users/unfollow', verifyUser, deleteFollowing, deleteFollower);

router.post('/posts', verifyUser, getPosts);
router.post('/posts/user', verifyUser, getPostsByUser);
router.post(
   '/posts/new/:postId',
   verifyUser,
   uploadImage,
   catchErrors(resizeImage),
   catchErrors(addPost),
);

router.post('/posts/delete/:postId', verifyUser, catchErrors(deletePost));

export default router;
