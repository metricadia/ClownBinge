import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import reactionsRouter from "./reactions";
import booksRouter from "./books";
import subscribersRouter from "./subscribers";
import tipsRouter from "./tips";
import sponsorsRouter from "./sponsors";
import verifyRouter from "./verify";
import fixmeRouter from "./fixme";
import factoidRouter from "./factoid";
import subscriptionRouter from "./subscription";
import membersRouter from "./members";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(reactionsRouter);
router.use(booksRouter);
router.use(subscribersRouter);
router.use(tipsRouter);
router.use(sponsorsRouter);
router.use(verifyRouter);
router.use(fixmeRouter);
router.use(factoidRouter);
router.use(subscriptionRouter);
router.use(membersRouter);

export default router;
