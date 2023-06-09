import express from "express";
import AuthService from "../../middlewares/auth";
import {
  upload,
  deleteS3File,
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
router.post("/", upload);
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
router.post("/multi", multiUpload);
router.post("/resize", resizeImage);
router.get("/resize", resizeImageStream);
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
router.delete("/:filename", AuthService.optional, deleteS3File);

export default router;
