import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const start = Date.now();
  console.log(`→ ${req.method} ${req.path}`);
  _res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`← ${req.method} ${req.path} ${_res.statusCode} (${duration}ms)`);
  });
  next();
}
