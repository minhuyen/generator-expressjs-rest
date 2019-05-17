import express from 'express';
import { authJwt } from '../../services/passport';
import { imageUpload } from '../../services/s3';
import { upload } from './uploads.controller';

const router = express.Router();

/**
 * @swagger
 *
 * /uploads:
 *   post:
 *     tags: [uploads]
 *     description: upload a file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload.
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *            image:
 *              type: string
 *              description: the image url
 *       400:
 *          $ref: '#/responses/Error'
 */
router.post('/', authJwt, imageUpload, upload);

export default router;
