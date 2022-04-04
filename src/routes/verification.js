const { Router } = require('express');
const text = require("body-parser/lib/types/text");
const user = require("../controllers/user");

const router = Router();

module.exports = () => {
    router.get('/verify/:userId/:token', async (req, res, next) => {
        try {
            const findUser = await user.findById(req.params.userId);
            if(!findUser || findUser.verificationToken !== req.params.token) {
                req.session.messages.push ({
                    text: 'Invalid credentials provided!',
                    type: 'danger'
                });
            } else {
                findUser.verified = true;
                await findUser.save();
                req.session.messages.push ({
                    text: 'Verification succesful!',
                    type: 'success'
                });
            }
            return res.redirect('/');
        } catch (err) {
            return next(err);
        }
    });

    return router;
}