import "dotenv/config";

import mqtt from "mqtt";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;

if (!mqttUsername || !mqttPassword) {
  throw new Error("MQTT_USERNAME and MQTT_PASSWORD must be set");
}

const mqttHost = process.env.MQTT_HOST ?? "localhost";

const mqttClient = mqtt.connect(`mqtts://${mqttHost}:8883`, {
  username: mqttUsername,
  password: mqttPassword,
  protocolVersion: 4,
  reconnectPeriod: 5000,
  clean: true,
});

mqttClient.on("connect", () => {
  console.log("✅ Bridge connected");

  mqttClient.subscribe("solar/device-001/telemetry", (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("✅ Subscription successful");
  }
});

  console.log("📡 Waiting for telemetry...");
});

mqttClient.on("message", async (topic, payload) => {
  console.log("📡 Topic:", topic);
  console.log("📦 Payload:", payload.toString());

  try {
    const data = JSON.parse(payload.toString());

    console.log("📥", data);

    const { error } = await supabase
      .from("readings")
      .insert({
        device_id: data.deviceId,
        panel_voltage: data.panelVoltage,
        panel_current: data.panelCurrent,
        battery_voltage: data.batteryVoltage,
        battery_current: data.batteryCurrent,
        temperature: data.temperature,
        humidity: data.humidity,
        recorded_at: data.timestamp,
      });

    if (error) {
      console.error("❌ Supabase Insert Error");
      console.error(error);
      return;
    }

    console.log("✅ Reading stored");

  } catch (err) {
    console.error(err);
  }
});

mqttClient.on("error", console.error);