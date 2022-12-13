import express from 'express';
import access  from './access/access';
import profile from './user/profile';
import users from './user/user'


const router = express.Router();

router.use('/', access);
router.use('/profile', profile);
router.use('/users', users)



export default router;
