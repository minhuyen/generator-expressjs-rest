var express = require('express'),
    router = express.Router(),
    user = require('./index'),
    auth = require('../../middlewares/authorization');

router.get('/me', auth.authenticate(), user.getUserLoggedInfo);
router.patch('/me', auth.authenticate(), user.patch);

module.exports = router;
