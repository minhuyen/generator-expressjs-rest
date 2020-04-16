import express from 'express';
import { celebrate } from 'celebrate';
import {
  findAll,
  findOne,
  create,
  update,
  remove,
  updateRegion,
  importCountryPrice,
} from './<%=name%>.controller';
import AuthService from '../../middlewares/auth';
import {
  createValidationSchema,
  updateValidationSchema,
  customPaginateValidateSchema,
} from './<%=name%>.validation';

const router = express.Router();
/**
 * @swagger
 *
 * definitions:
 *   <%=name%>:
 *     type: object
 *     required:
 *       - country_name
 *       - country_code
 *       - country_number
 *       - country_flag
 *     properties:
 *       country_name:
 *         type: string
 *       country_code:
 *         type: string
 *       country_number:
 *         type: string
 *       country_flag:
 *         type: string
 *       regions:
 *         type: array
 *         items:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              code:
 *                type: string
 *       number_type:
 *            type: array
 *            items:
 *              type: string
 *
 *   ArrayOfCountries:
 *      type: array
 *      items:
 *        $ref: '#/definitions/Country'
 */

/**
 * @swagger
 *
 * /countries:
 *   post:
 *     tags: [countries]
 *     description: create a country
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/Country'
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Country'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */

router.post(
  '/',
  [AuthService.required, celebrate({ body: createValidationSchema })],
  create
);

/**
 * @swagger
 *
 * /countries:
 *   put:
 *     tags: [countries]
 *     description: create a country
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/Country'
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Country'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */

router.put(
  '/:id',
  [AuthService.required],
  celebrate({ body: updateValidationSchema }),
  update
);

/**
 * @swagger
 *
 * /countries:
 *   get:
 *     tags: [countries]
 *     description: get all countries
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters/pageParam'
 *       - $ref: '#/parameters/limitParam'
 *     responses:
 *        200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *              page:
 *                type: integer
 *                format: int32
 *              pages:
 *                type: integer
 *                format: int32
 *              limit:
 *                type: integer
 *                format: int32
 *              total:
 *                type: integer
 *                format: int32
 *              data:
 *                $ref: '#/definitions/ArrayOfCountries'
 *        401:
 *          $ref: '#/responses/Unauthorized'
 */
router.get(
  '/',
  AuthService.optional,
  celebrate({ query: customPaginateValidateSchema }),
  findAll
);

/**
 * @swagger
 *
 * /countries/{id}:
 *   get:
 *     tags: [countries]
 *     description: get detail country
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: country id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Country'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.get('/:id', findOne);

/**
 * @swagger
 *
 * /countries/{id}:
 *   delete:
 *     tags: [countries]
 *     description: delete a country
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: countries id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/Country'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.delete('/:id', AuthService.required, remove);


export default router;
