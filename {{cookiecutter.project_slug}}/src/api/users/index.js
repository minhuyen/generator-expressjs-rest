import express from 'express';
import { authJwt } from '../../services/passport';
import { findAll, findOne, deleteUser, updateAvatar } from './controller';

const router = express.Router();

router.get('/', authJwt, findAll);
router.get('/:id', authJwt, findOne);
router.delete('/:id', authJwt, deleteUser);
router.put('/:id/avatar', authJwt, updateAvatar);

export default router;
