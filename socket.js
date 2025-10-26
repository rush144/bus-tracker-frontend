import { io } from "socket.io-client";
import { BACKEND_URL } from "./config";

const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
  auth: {
    token: localStorage.getItem("token"),
  },
});

export default socket;
