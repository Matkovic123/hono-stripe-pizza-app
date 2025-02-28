import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const app = new Hono();
app.get("/", (c) => {
  return c.text("Hello mom!");
});

app.post("/checkout", async (c) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: "price_1Qx7WqFV8WVarqtCCwXSQwJd", quantity: 1 }],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    return c.json(session);
  } catch (error: any) {
    console.log(error);
    throw new HTTPException(500, { message: error?.message });
  }
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

app.get("/success", (c) => {
  return c.text("Success");
});

app.get("/cancel", (c) => {
  return c.text("Cancel");
});
