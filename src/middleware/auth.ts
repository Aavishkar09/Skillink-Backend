import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedUser } from '../types/auth';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  // Temporary: use token as user ID directly
  // In production, you should verify JWT token
  
  // Check for explicit role header first
  const explicitRole = req.headers['x-user-role'] as string;
  let userRole = 'USER'; // default
  
  if (explicitRole) {
    userRole = explicitRole;
  } else {
    // Fallback: detect role based on referer
    const referer = req.headers.referer || '';
    userRole = referer.includes('company-chat') ? 'COMPANY' : 'USER';
  }
  
  req.user = { id: token, email: 'temp@example.com', role: userRole };
  next();
};
