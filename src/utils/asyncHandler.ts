import { Request, Response, NextFunction } from "express";

// Cette fonction prend une route async et attrape les erreurs automatiquement
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export default asyncHandler;
