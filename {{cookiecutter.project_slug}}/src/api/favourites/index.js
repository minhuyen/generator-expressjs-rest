import express from 'express';
import { authJwt } from '../../services/passport';
import { create, findAll, findById, update, remove } from './controller';
import { createValidation } from './validation';

const router = express.Router();

router.post('/', authJwt, createValidation, create);
router.get('/', authJwt, findAll);
router.get('/:id', authJwt, findById);
router.put('/:id', authJwt, update);
router.delete('/:id', authJwt, remove);

export default router;
