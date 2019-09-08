import jwt from 'jsonwebtoken';

const createJWT = (id:number):string => jwt.sign({ id }, process.env.JWT_SECRET || '');

export default createJWT;
