import mqtt from "mqtt";

const HOST = "6666eaf6ba24490581db583205a0c7df.s1.eu.hivemq.cloud";

const USERNAME = "SolarDR";
const PASSWORD = "Thepageseth@1";

const client = mqtt.connect(`wss://${HOST}:8884/mqtt`, {
  username: USERNAME,
  password: PASSWORD,
  protocolVersion: 4,
  reconnectPeriod: 0,
  clean: true,
});

client.on("connect", () => {
  console.log("✅ Connected to HiveMQ");

  client.subscribe("solar/test", (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("✅ Subscribed");

    // Give the broker a moment to register the subscription
    setTimeout(() => {
      client.publish(
        "solar/test",
        JSON.stringify({
          message: "Hello SolarDR",
          time: new Date().toISOString(),
        })
      );
    }, 500);
  });
});

client.on("message", (topic, payload) => {
  console.log("📨 Topic:", topic);
  console.log("📨 Payload:", payload.toString());

  // Stop after proving publish/subscribe works
  client.end();
});

client.on("close", () => {
  console.log("✅ MQTT Test Finished");
});

client.on("error", (err) => {
  console.error(err);
});