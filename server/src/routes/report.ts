import { Router } from "express";
import { listReports } from "../controllers/reportController.js";

export const reportRouter = Router();

reportRouter.get("/", listReports);

export default reportRouter;
