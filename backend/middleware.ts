import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { envFiles } from "./env.ts"

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

interface MyTokenPayload {
  userId: string
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization
  if (!authorization) {
    throw new Error("No authorization was provided")
  }
  if (!authorization.startsWith("Bearer ")) {
    res.status(403).json({ message: "Invalid authorization" })
  }

  const token = authorization.split(' ')[1]
  if (!token) {
    res.status(403).json({ message: "Token undefined" })
  }

  try {
    const decoded = jwt.verify(token, envFiles.jwtSecret) as MyTokenPayload
    const userId = decoded.userId

    if (userId) {
      req.userId = userId
      next()
    } else {
      res.status(403).json({ message: "Invalid Token" })
    }
  } catch (error) {
    console.error(error)
  }
}

