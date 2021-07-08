const {Router} = require('express');
const userCtrl = require('../controllers/user.controller');

const router = Router();

router.get('/users', userCtrl.getAll);

module.exports = router;