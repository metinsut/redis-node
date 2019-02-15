const signOut = (req, res) => {
   req.logout();
   res.json({
      fail: false,
      success: {
         message: 'You have been log out.',
      },
   });
};

export default signOut;
