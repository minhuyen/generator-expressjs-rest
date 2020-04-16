import express from 'express';
import { celebrate } from 'celebrate';
import {
  findAll,
  findOne,
  create,
  update,
  remove
} from './<%=camelName%>.controller';
import AuthService from '../../middlewares/auth';
import {
  createValidationSchema,
  updateValidationSchema,
  customPaginateValidateSchema,
} from './<%=camelName%>.validation';

const router = express.Router();
/**
 * @swagger
 *
 * definitions:
 *   <%=name%>:
 *     type: object
 *     required:
 *       - field1
 *       - field2
 *     properties:
 *       field1:
 *         type: string
 *       field2:
 *         type: string
 *
 *   ArrayOf<%=names%>:
 *      type: array
 *      items:
 *        $ref: '#/definitions/<%=name%>'
 */

/**
 * @swagger
 *
 * /<%=camelNames%>:
 *   post:
 *     tags: [<%=camelNames%>]
 *     description: create a <%=camelName%>
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/<%=name%>'
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/<%=name%>'
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
 * /<%=camelNames%>:
 *   put:
 *     tags: [<%=camelNames%>]
 *     description: create a <%=camelName%>
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/<%=name%>'
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/<%=name%>'
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
 * /<%=camelNames%>:
 *   get:
 *     tags: [<%=camelNames%>]
 *     description: get all <%=camelNames%>
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
 *                $ref: '#/definitions/ArrayOf<%=names%>'
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
 * /<%=camelNames%>/{id}:
 *   get:
 *     tags: [<%=camelNames%>]
 *     description: get detail <%=camelName%>
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: <%=camelName%> id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/<%=name%>'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.get('/:id', findOne);

/**
 * @swagger
 *
 * /<%=camelNames%>/{id}:
 *   delete:
 *     tags: [<%=camelNames%>]
 *     description: delete a <%=camelName%>
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: <%=camelNames%> id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/<%=name%>'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.delete('/:id', AuthService.required, remove);


export default router;
