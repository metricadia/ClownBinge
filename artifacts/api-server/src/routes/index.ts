import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import reactionsRouter from "./reactions";
import booksRouter from "./books";
import subscribersRouter from "./subscribers";
import tipsRouter from "./tips";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(reactionsRouter);
router.use(booksRouter);
router.use(subscribersRouter);
router.use(tipsRouter);

export default router;
