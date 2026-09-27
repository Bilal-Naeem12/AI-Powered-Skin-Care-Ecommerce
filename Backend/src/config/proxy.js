function configureProxy(app, env = process.env) {
  // Render terminates public requests at its reverse proxy. Never trust all hops.
  const raw = env.TRUST_PROXY_HOPS ?? (env.RENDER === "true" ? "1" : "0");
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(Number(raw))) {
    throw new Error("TRUST_PROXY_HOPS must be a non-negative integer");
  }
  app.set("trust proxy", Number(raw));
}

module.exports = { configureProxy };
