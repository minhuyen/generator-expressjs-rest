import { Router } from 'express';
import auth from './auth';
import users from './users';
import collections from './collections';
import recipes from './recipes';
import favourites from './favourites';
import calendars from './calendars';
import uploads from './uploads';

const router = new Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/collections', collections);
router.use('/recipes', recipes);
router.use('/favourites', favourites);
router.use('/calendars', calendars);
router.use('/uploads', uploads);

export default router;
