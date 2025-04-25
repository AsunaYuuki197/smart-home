import mqtt from "mqtt";

const AIO_USERNAME = process.env.NEXT_PUBLIC_AIO_USERNAME;
const AIO_KEY = process.env.NEXT_PUBLIC_AIO_KEY;
// const FEED_NAME = process.env.NEXT_PUBLIC_TEMPERATURE_FEED; // hoặc "temperature"

const FEEDS =[ "fan", "fanspeed", "huminity", "temperature", "on-off-light", "lightcolor", "lightlevel", "light", "pump", "detectpeople"]

const mqttClient = mqtt.connect("mqtts://io.adafruit.com", {
  username: AIO_USERNAME,
  password: AIO_KEY,
});

mqttClient.on("connect", () => {
  console.log("🔌 MQTT connected");

  FEEDS.forEach((feed) => {
    mqttClient.subscribe(`${AIO_USERNAME}/feeds/${feed}`, (err) => {
      if (err) console.error("Subscribe error:", err);
    });
  });
  
});

mqttClient.on("message", (topic, message) => {
  const feed = topic.split("/").pop(); // Tên feed cuối cùng trong topic
  const value = message.toString();

  console.log(`📬 Feed [${feed}] → Value: ${value}`);

});

export default mqttClient;
