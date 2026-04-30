import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import productsRouter from "./products";
import postsRouter from "./posts";
import homeRouter from "./home";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(productsRouter);
router.use(postsRouter);
router.use(homeRouter);
router.use(adminRouter);

export default router;
