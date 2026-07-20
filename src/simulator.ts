import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEVICE_ID = process.env.DEVICE_ID ?? "device-001";

function random(min: number, max: number, decimals = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

async function publishReading() {
  const reading = {
    device_id: DEVICE_ID,
    panel_voltage: random(18.5, 22.5),
    panel_current: random(2.5, 6.0),
    battery_voltage: random(12.0, 13.2),
    battery_current: random(1.5, 4.5),
    temperature: random(28, 38),
    humidity: random(45, 80),
    recorded_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("readings")
    .insert(reading);

  if (error) {
    console.error("❌ Insert failed");
    console.error(error);
    return;
  }

  console.log("✅ Reading stored");
  console.table(reading);
}

console.log("🚀 Simulator started");

publishReading();

setInterval(publishReading, 5000);