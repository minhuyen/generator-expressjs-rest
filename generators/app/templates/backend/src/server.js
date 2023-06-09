const debug = require("debug")("app:http");
import http from "http";
const { createTerminus } = require("@godaddy/terminus");
import app from "./app"; // the actual Express app

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});

function onSignal() {
  console.log("server is starting cleanup");
  // start cleanup of resource, like databases or file descriptors
}

async function onHealthCheck() {
  // checks if the system is healthy, like the db connection is live
  // resolves, if health, rejects if not
}

createTerminus(server, {
  signal: "SIGINT",
  healthChecks: { "/healthcheck": onHealthCheck },
  onSignal
});

server.listen(PORT, () => {
  debug(`Server running on port ${PORT}`);
});
