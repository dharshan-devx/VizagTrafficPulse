import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import path from "path";
import { fileURLToPath } from "url";

// __dirname helper for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🧾 Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse)
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // ⚠️ Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });

  // ⚙️ Frontend setup
  if (app.get("env") === "development") {
    // Vite integration for dev
    await setupVite(app, server);
  } else {
    // Serve built static frontend for production
    app.use(express.static(path.join(__dirname, "public")));

    // SPA fallback for client-side routing
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "public/index.html"));
    });
  }

  // 🚀 Start server
  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "localhost"; // ✅ FIXED: browser-friendly host

  server.listen(port, host, () => {
    log(`✅ Server running on http://${host}:${port}`);
    console.log(`👉 Open in browser: http://${host}:${port}`);
  });
})();
