import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/socket-types";
import { SOCKET_EVENTS } from "@/lib/routes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { serverId, event } = req.body;

  if (!serverId || !event) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (!res?.socket?.server?.io) {
    return res.status(500).json({ error: "Socket server not active" });
  }

  if (event === SOCKET_EVENTS.SERVER_UPDATE) {
    res?.socket?.server?.io?.emit(SOCKET_EVENTS.serverUpdated(serverId));
  } else if (event === SOCKET_EVENTS.SERVER_DELETE) {
    res?.socket?.server?.io?.emit(SOCKET_EVENTS.serverDeleted(serverId));
  }

  return res.status(200).json({ message: "OK" });
}
