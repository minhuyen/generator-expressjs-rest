import express from 'express';
import AuthService from '../../middlewares/auth';
import PackageCtrl from './packages.controller';

const router = express.Router();

router.post('/', AuthService.required, AuthService.isAdmin(), PackageCtrl.create)

router.get('/', PackageCtrl.findAll)
router.get('/:id', PackageCtrl.findOne)

router.put('/:id', AuthService.required, AuthService.isAdmin(), PackageCtrl.update)

router.delete('/:id', AuthService.required, AuthService.isAdmin(), PackageCtrl.remove)

export default router
