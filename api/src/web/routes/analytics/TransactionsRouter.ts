import { Request, Response, Router } from "express";
import { Dependencies, TransactionResponse } from "../../../types";

function build({ getData, dbClient }: Dependencies): Router {
  const router = Router();

  interface Query {
    pool?: string;
    token?: string;
    account?: string;
    type?: "swap" | "liquidity";
  }

  router.get("/", async (req: Request<{}, {}, {}, Query>, res: Response) => {
    try {
      // Get system wide pools and tokens data
      const data = await getData();

      let transactions: TransactionResponse[];

      if (req.query.pool) {
        if (!data.pools.includes(req.query.pool)) {
          res.json({ error: "Pool does not exist." });
          return;
        }
        // Select transactions where the given pool is involved
        const _entry = await dbClient.raw(`
          SELECT
            ts timestamp,
            hash opHash,
            pool,
            account,
            type,
            token_1_amount token1Amount,
            token_2_amount token2Amount,
            value
          FROM transaction
          WHERE pool='${req.query.pool}'
          ORDER BY ts
          LIMIT 100;
        `);
        transactions = _entry.rows;
      } else if (req.query.token) {
        if (!data.tokens[req.query.token]) {
          res.json({ error: "Token does not exist." });
          return;
        }

        // Select transactions where the given token is involved
        const _entry = await dbClient.raw(`
          SELECT
            t.ts timestamp,
            t.hash opHash,
            t.pool,
            t.account,
            t.type,
            t.token_1_amount token1Amount,
            t.token_2_amount token2Amount,
            t.value
          FROM transaction t
          JOIN data d ON t.pool=d.pool
          WHERE d.token_1='${req.query.token}' OR d.token_2='${req.query.token}'
          ORDER BY ts
          LIMIT 100;
        `);

        transactions = _entry.rows;
      } // This can be improved by reducing code-repetition
      else if (req.query.account && req.query.type) {
        // Used only for the airdrop backend
        const _entry = await dbClient.raw(`
          SELECT
            id,
            ts timestamp,
            hash opHash,
            pool,
            account,
            type,
            token_1_amount token1Amount,
            token_2_amount token2Amount,
            value
          FROM transaction
          WHERE 
            account='${req.query.account}'
              AND 
            ${req.query.type === "swap" ? "(type='swap_token_1' OR type='swap_token_2')" : "type='add_liquidity'"}
          ORDER BY ts
          LIMIT 100;
        `);

        transactions = _entry.rows;
      } else {
        // Select top transactions by ts
        const _entry = await dbClient.raw(`
          SELECT 
            ts timestamp,
            hash opHash,
            pool,
            account,
            type,
            token_1_amount token1Amount,
            token_2_amount token2Amount,
            value
          FROM transaction
          ORDER BY ts
          LIMIT 100;
        `);
        transactions = _entry.rows;
      }

      res.json(transactions).status(200);
    } catch (err) {
      res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
      console.error(err.message);
    }
  });

  return router;
}

export default build;
