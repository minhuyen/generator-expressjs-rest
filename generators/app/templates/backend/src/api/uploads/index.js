import express from "express";
import AuthService from "../../middlewares/auth";
import { imageUpload, imagesUpload } from "../../services/storage";
import {
  upload,
  deleteFile,
  multiUpload,
  resizeImage,
  resizeImageStream
} from "./upload.controller";

const router = express.Router();

/**
 * @swagger
 *
 * /uploads:
 *   post:
 *     tags: [uploads]
 *     description: upload a file. Fill url will be http://server/media/filename
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The file to upload.
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *            data:
 *              type: object
 *              properties:
 *                url:
 *                  type: string
 *                thumbnail:
 *                  type: string
 *
 *       400:
 *          $ref: '#/responses/Error'
 */
router.post("/", imageUpload, upload);
/**
 * @swagger
 *
 * /uploads/multi:
 *   post:
 *     tags: [uploads]
 *     description: upload multi file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: photos
 *         type: file
 *         description: The file to upload.
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  url:
 *                    type: string
 *                  thumbnail:
 *                    type: string
 *       400:
 *          $ref: '#/responses/Error'
 */
router.post("/multi", imagesUpload, multiUpload);
/**
 * @swagger
 *
 * /uploads/{filename}:
 *   delete:
 *     tags: [uploads]
 *     description: upload a file
 *     parameters:
 *       - name: filename
 *         in: path
 *         description: file name
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *            message:
 *              type: string
 *       400:
 *          $ref: '#/responses/Error'
 */
router.delete("/:filename", AuthService.optional, deleteFile);

export default router;
