// Track active network hacker nodes
const activeNodes = new Set();

// Collaborative security broadcast feed of active hacking events
const securityFeed = [
  { id: "feed_1", message: "🔒 Core Network security firewall is fully operational.", type: "info", time: new Date().toLocaleTimeString() },
  { id: "feed_2", message: "📡 Listening for external intrusion requests on interfaces...", type: "alert", time: new Date().toLocaleTimeString() },
];

/**
 * Handles all live socket events for active nodes, terminals, and security feeds.
 * @param {import("socket.io").Server} io 
 */
export default function socketHandler(io) {
  io.on("connection", (socket) => {
    // Add socket to active nodes and broadcast count
    activeNodes.add(socket.id);
    io.emit("node_count_update", activeNodes.size);

    // Send the existing log of events to the newly connected hacker
    socket.emit("initial_feed", securityFeed);

    // Event: A hacker solved a CTF challenge or completed a lesson/lab
    socket.on("solve_challenge", (data) => {
      const alertLog = {
        id: `feed_${Date.now()}`,
        message: `🚨 [ALERT] Node "${data.username || "Hacker"}" cracked challenge: "${data.challengeName}"! +${data.xp || 100} XP`,
        type: "success",
        time: new Date().toLocaleTimeString()
      };
      securityFeed.push(alertLog);
      if (securityFeed.length > 30) securityFeed.shift();
      io.emit("security_feed_update", alertLog);
    });

    // Event: A hacker ran a terminal command in Kali
    socket.on("terminal_command", (data) => {
      const commandLog = {
        id: `feed_${Date.now()}`,
        message: `💻 [CONSOLE] Node "${data.username || "Hacker"}" executed: \`${data.command}\``,
        type: "command",
        time: new Date().toLocaleTimeString()
      };
      securityFeed.push(commandLog);
      if (securityFeed.length > 30) securityFeed.shift();
      io.emit("security_feed_update", commandLog);
    });

    // Event: Hacker Chat message
    socket.on("chat_message", (data) => {
      const msg = data.message || "";
      const hasNoSql = msg.includes("$gt") || msg.includes("$ne") || msg.includes("$eq") || msg.includes("$lt") || (msg.includes("$") && (msg.includes("{") || msg.includes("}")));

      if (hasNoSql) {
        // Trigger active defense block alert
        const alertLog = {
          id: `feed_${Date.now()}`,
          message: `🛡️ [SHIELD] BLOCKED NoSQL Injection attempt from "${data.username || "Hacker"}". Pattern detected: "${msg}"`,
          type: "alert",
          time: new Date().toLocaleTimeString()
        };
        securityFeed.push(alertLog);
        if (securityFeed.length > 30) securityFeed.shift();
        io.emit("security_feed_update", alertLog);
        return;
      }

      const chatLog = {
        id: `feed_${Date.now()}`,
        message: `💬 [CHAT] ${data.username || "Hacker"}: ${data.message}`,
        type: "chat",
        time: new Date().toLocaleTimeString()
      };
      securityFeed.push(chatLog);
      if (securityFeed.length > 30) securityFeed.shift();
      io.emit("security_feed_update", chatLog);
    });

    socket.on("disconnect", () => {
      activeNodes.delete(socket.id);
      io.emit("node_count_update", activeNodes.size);
    });
  });
}
