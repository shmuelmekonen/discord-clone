import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types/socket-types";
import { SOCKET_EVENTS } from "@/lib/routes";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as unknown as NetServer;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on(SOCKET_EVENTS.SERVER_UPDATE, (serverId) => {
        io.emit(SOCKET_EVENTS.serverUpdated(serverId));
      });

      socket.on(SOCKET_EVENTS.SERVER_DELETE, (serverId) => {
        io.emit(SOCKET_EVENTS.serverDeleted(serverId));
      });

      socket.on(SOCKET_EVENTS.MEMBER_KICK, ({ serverId, memberId }) => {
        io.emit(SOCKET_EVENTS.serverUpdated(serverId));
        io.emit(SOCKET_EVENTS.memberKicked(memberId), serverId);
      });
    });
  }
  res.end();
};

export default ioHandler;
