import express from 'express';
import { authJwt } from '../../services/passport';
import { imageUpload } from '../../services/s3';
import { upload } from './uploads.controller';

const router = express.Router();

router.post('/', authJwt, imageUpload, upload);

export default router;
