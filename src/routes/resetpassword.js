const { Router } = require('express');
const { findByEmail } = require('../controllers/user');
const user = require('../controllers/user');
const validation = require('../middlewares/validation');

const router = Router();

module.exports = () => {

  router.get('/resetpassword', (req, res) => {
    res.render('resetpassword', { page: 'resetpassword' });
  });
  router.post(
    '/resetpassword',
    validation.validateEmail,
    async (req, res, next) => {
      try {
        const validationErrors = validation.validationResult(req);
        const errors = [];
        if (!validationErrors.isEmpty()) {
          validationErrors.errors.forEach((error) => {
            errors.push(error.param);
            req.session.messages.push({
              text: error.msg,
              type: 'danger',
            });
          });
        } else {
          /**
           * @todo: Find the user and create a reset token
           */
          const findUser = await user.findByEmail(req.body.email);
          if(findUser) {
            const resetToken = await user.createPasswordResetToken(findUser.id);
          }
        }

        if (errors.length) {
          // Render the page again and show the errors
          return res.render('resetpassword', {
            page: 'resetpassword',
            data: req.body,
            errors,
          });
        }

        req.session.messages.push({
          //do not tell the user what emails are stored in the db
          text: 'If we found a matching user, you will receive a password reset link.',
          type: 'info',
        });
        /**
         * @todo: On success, redirect the user to some other page, like the login page
         */
        return res.redirect('/');
      } catch (err) {
        return next(err);
      }
    }
  );

  /**
   * GET route to verify the reset token and show the form to change the password
   */
   router.get('/resetpassword/:userId/:resetToken', async (req, res, next) => {
    try {
      /**
       * @todo: Validate the token and render the password change form if valid
       */
      const resetToken = await user.verifyPasswordResetToken(req.params.userId, req.params.resetToken);
      if(!resetToken) {
        req.session.messages.push({
          text: 'Invalid token!',
          type: 'danger'
        });

        return res.redirect('/resetpassword');
      }

      return res.render('changepassword', { page: 'resetpassword', userId: req.params.userId, resetToken: req.params.resetToken});
    } catch (err) {
      return next(err);
    }
  });

  router.post(
    '/resetpassword/:userId/:resetToken',
    validation.validatePass,
    validation.validatePassMatch,
    async (req, res, next) => {
      try {
        /**
         * @todo: Validate the provided credentials
         */
        const resetToken = await user.verifyPasswordResetToken(req.params.userId, req.params.resetToken);
        if(!resetToken){
          req.session.messages.push({
            text: 'The token is invalid.',
            type: 'danger'
          });
          return res.redirect('/resetpassword');
        }
        const validationErrors = validation.validationResult(req);
        const errors = [];
        if (!validationErrors.isEmpty()) {
          validationErrors.errors.forEach((error) => {
            errors.push(error.param);
            req.session.messages.push({
              text: error.msg,
              type: 'danger',
            });
          });
        }

        if (errors.length) {
          // Render the page again and show the errors
          return res.render('changepassword', {
            page: 'resetpassword',
            data: req.body,
            userId: req.params.userId,
            resetToken: req.params.resetToken,
            errors,
          });
        }

        /**
         * @todo: Change password, remove token and redirect to login
         */
        await user.changePassword(req.params.userId, req.body.password);
        await user.deletePasswordResetToken(req.params.resetToken);
        req.session.messages.push({
          text: 'Your password has been changed.',
          type: 'success'
        });
        return res.redirect('/login');
      } catch (err) {
        return next(err);
      }
    }
  );
  
  return router;
};