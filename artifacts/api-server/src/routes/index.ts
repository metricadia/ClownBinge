import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import reactionsRouter from "./reactions";
import booksRouter from "./books";
import subscribersRouter from "./subscribers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(reactionsRouter);
router.use(booksRouter);
router.use(subscribersRouter);

export default router;
