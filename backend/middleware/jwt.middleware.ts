import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function checkJwt(req: Request, res: Response, next: NextFunction) {
  // Get the token from the header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    // No token provided
    return res.status(401).send({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const payload = jwt.verify(token, 'secret');
    req.body.user = payload; // Attach the payload to the request object
    next();
    return;
  } catch (err) {
    // Invalid token
    return res.status(401).send({ message: 'Invalid token' });
  }
}
