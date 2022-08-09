import { Router } from "express";
import TokensRouter from "./TokensRouter";
import PlentyRouter from "./PlentyRouter";
import PoolsRouter from "./PoolsRouter";
import TransactionsRouter from "./TransactionsRouter";

import { Dependencies } from "../../../types";

function build(dependencies: Dependencies): Router {
  const router = Router();
  router.use("/pools", PoolsRouter(dependencies));
  router.use("/tokens", TokensRouter(dependencies));
  router.use("/plenty", PlentyRouter(dependencies));
  router.use("/transactions", TransactionsRouter(dependencies));
  return router;
}

export default build;
