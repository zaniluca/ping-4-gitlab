import { Router } from "express";
import gitlab from "./gitlab";

const router = Router();
router.use("/gitlab", gitlab);

export default router;
