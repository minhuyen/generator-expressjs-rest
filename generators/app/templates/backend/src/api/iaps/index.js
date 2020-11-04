import express from 'express';
import AuthService from '../../middlewares/auth';
import IAPCtrl from './iap.controller';

const router = express.Router();

router.post('/', AuthService.required, AuthService.isAdmin(), IAPCtrl.create)
router.post('/verify-receipt', AuthService.required, IAPCtrl.verifyReceipt)
router.post('/subscription', AuthService.required, IAPCtrl.subscription)

router.get('/', IAPCtrl.findAll)
router.get('/:id', IAPCtrl.findOne)

router.put('/:id', AuthService.required, AuthService.isAdmin(), IAPCtrl.update)

router.delete('/:id', AuthService.required, AuthService.isAdmin(), IAPCtrl.remove)

export default router
