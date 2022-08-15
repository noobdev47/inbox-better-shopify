import axios from "axios";
import { Shopify } from "@shopify/shopify-api";
import { gdprTopics } from "@shopify/shopify-api/dist/webhooks/registry.js";

import ensureBilling from "../helpers/ensure-billing.js";
import topLevelAuthRedirect from "../helpers/top-level-auth-redirect.js";

export default function applyAuthMiddleware(
  app,
  { billing = { required: false } } = { billing: { required: false } }
) {

  app.get('/', (req, res) => {
    if (req.query) {
      return res.redirect(`https://${req.query.shop}/admin/oauth/authorize?client_id=${'dfd42864e76a79bc850da9dd10cc7497'}&scope=${'write_orders'}&redirect_uri=${'https://3e34-203-175-73-170.ngrok.io/auth/login'}&state=${'inboxbetter'}&grant_options[]={}`)
    }
  })

  app.post('/api/access_token', async (req, response) => {
    if (req.query) {
      await axios.post(`https://${req.query.shop}/admin/oauth/access_token`, {
        client_id: 'dfd42864e76a79bc850da9dd10cc7497',
        client_secret: '7af4a269fad7c3574e225143a435fd13',
        code: req.query.code,
      }).then((res) => {
        response.status(200)
        response.json({ "access_token": res.data.access_token })
      })
    }
  })

  app.get("/api/auth", async (req, res) => {
    if (!req.query.shop) {
      res.status(500);
      return res.send("No shop provided");
    }

    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      return res.redirect(`/ api / auth / toplevel ? shop = ${req.query.shop}`);
    }

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      "/api/auth/callback",
      app.get("use-online-tokens")
    );

    res.redirect(redirectUrl);
  });

  app.get("/api/auth/toplevel", (req, res) => {
    res.cookie(app.get("top-level-oauth-cookie"), "1", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res.set("Content-Type", "text/html");

    res.send(
      topLevelAuthRedirect({
        apiKey: Shopify.Context.API_KEY,
        hostName: Shopify.Context.HOST_NAME,
        shop: req.query.shop,
      })
    );
  });

  app.get("/api/auth/callback", async (req, res) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );

      const host = req.query.host;

      const responses = await Shopify.Webhooks.Registry.registerAll({
        shop: session.shop,
        accessToken: session.accessToken,
      });

      Object.entries(responses).map(([topic, response]) => {
        // The response from registerAll will include errors for the GDPR topics.  These can be safely ignored.
        // To register the GDPR topics, please set the appropriate webhook endpoint in the
        // 'GDPR mandatory webhooks' section of 'App setup' in the Partners Dashboard.
        if (!response.success && !gdprTopics.includes(topic)) {
          console.log(
            `Failed to register ${topic} webhook: ${response.result.errors[0].message}`
          );
        }
      });

      // If billing is required, check if the store needs to be charged right away to minimize the number of redirects.
      let redirectUrl = `/? shop = ${session.shop} & host=${host}`;
      if (billing.required) {
        const [hasPayment, confirmationUrl] = await ensureBilling(
          session,
          billing
        );

        if (!hasPayment) {
          redirectUrl = confirmationUrl;
        }
      }

      // Redirect to app with shop parameter upon auth
      res.redirect(redirectUrl);
    } catch (e) {
      console.warn(e);
      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          res.redirect(`/ api / auth ? shop = ${req.query.shop}`);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
}
