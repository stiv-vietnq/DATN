import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const connectNotificationWS = (
  userId: number,
  onMessage: (msg: any) => void
) => {
  const socket = new SockJS("http://localhost:8888/ws");

  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    client.subscribe(`/topic/notifications/${userId}`, (msg) => {
      onMessage(JSON.parse(msg.body));
    });
  };

  client.activate();
  return client;
};
