// hooks/useMqttClient.ts
"use client";
import { useEffect, useRef } from "react";
import mqtt from "mqtt";

const AIO_USERNAME = process.env.NEXT_PUBLIC_AIO_USERNAME;
const AIO_KEY = process.env.NEXT_PUBLIC_AIO_KEY;
const FEEDS = [ "fan", "fanspeed", "huminity", "temperature", "on_off_light", "lightcolor", "lightlevel", "light", "pump", "detectpeople"];

export function useMqttClient(onMessage: (feed: string, value: string) => void) {
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  console.log("AIO_USERNAME", AIO_USERNAME);
  console.log("AIO_KEY", AIO_KEY);
  useEffect(() => {
    const client = mqtt.connect("wss://io.adafruit.com", {
      username: AIO_USERNAME,
      password: AIO_KEY,
    });

    client.on("connect", () => {
      console.log("✅ Connected to Adafruit MQTT from client");
      FEEDS.forEach((feed) => {
        const topic = `${AIO_USERNAME}/feeds/${feed}`;
        client.subscribe(topic, (err) => {
          if (err) {
            console.error(`❌ Failed to subscribe to ${topic}`, err);
          } else {
            // console.log(`📡 Subscribed to ${topic}`);
          }
        });
      });
    });

    client.on("message", (topic, message) => {
      const feed = topic.split("/").pop()!;
      const value = message.toString();
      onMessage(feed, value);
      // console.log(`📥 Received message from ${topic}: ${value}`);
    });
    client.on("error", (err) => {
      console.error("❌ MQTT Connection Error:", err?.message);
    });

    client.on("reconnect", () => {
      console.warn("⚠️ Reconnecting to MQTT...");
    });
    clientRef.current = client;

    return () => {
      console.log("❌ Disconnecting from MQTT");
      client.end(true);
    };
  }, [onMessage]);

  const publish = (feed: string, value: string) => {
    clientRef.current?.publish(`${AIO_USERNAME}/feeds/${feed}`, value);
  };
  
  return {
    publish,
  };
}
