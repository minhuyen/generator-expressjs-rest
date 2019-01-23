import express from 'express';
import { authJwt } from '../../services/passport';
import { createValidation } from './validation';
import { imageUpload } from '../../services/s3';
import { create, findById, findAll, update, remove } from './controller';

const router = express.Router();

router.post('/', authJwt, imageUpload, createValidation, create);
router.get('/', findAll);
router.get('/:id', findById);
router.put('/:id', authJwt, update);
router.delete('/:id', authJwt, remove);

export default router;
