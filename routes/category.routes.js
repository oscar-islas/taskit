const {Router} = require('express');
const catCtrl = require('../controllers/category.controller');
const protectRoute = require('../middlewares/protect-routes');

const router = Router();

router.get('/categorias', protectRoute, catCtrl.render);

router.post('/categorias', protectRoute, catCtrl.create);

router.get('/categorias/borrar/:id', protectRoute, catCtrl._delete);

router.get('/categorias/editar/:id', protectRoute, catCtrl.renderEdit);
router.post('/categorias/editar/:id', protectRoute, catCtrl.update);


module.exports = router;