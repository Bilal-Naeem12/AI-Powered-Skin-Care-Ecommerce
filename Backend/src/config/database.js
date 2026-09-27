const mongoose = require("mongoose");
const dns = require("node:dns");
async function connectDb() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  // Optional override for environments where Node's resolver differs from the OS.
  const servers = process.env.MONGODB_DNS_SERVERS;
  if (servers && servers.trim()) {
    dns.setServers(servers.split(",").map(server => server.trim()).filter(Boolean));
  }
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
}
module.exports = { connectDb };
