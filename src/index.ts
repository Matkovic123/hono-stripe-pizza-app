import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const app = new Hono();
app.get("/", (c) => {
  return c.text("Hello mom!");
});

app.post("/", (c) => {
  return c.text("Post request!");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
