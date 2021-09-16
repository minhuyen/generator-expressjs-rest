import express from 'express';
import configController from './config.controller';
import AuthService from '../../middlewares/auth';

const router = express.Router();

router.post('/', AuthService.required, AuthService.isAdmin(), configController.create)
router.put('/:id', AuthService.required, AuthService.isAdmin(), configController.update)
router.get('/', AuthService.required, AuthService.isAdmin(), configController.findAll)
router.get('/all', configController.listConfigsForApp)
router.get('/:id', AuthService.required, AuthService.isAdmin(), configController.findOne)
router.delete('/:id', AuthService.required, AuthService.isAdmin(), configController.remove)

export default router;
