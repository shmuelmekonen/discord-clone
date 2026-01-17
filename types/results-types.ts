import { Server } from "@prisma/client";

export type JoinServerData = {
  server: Server;
  joinedNew: boolean;
};

export type LeaveOrDeleteServerResult = {
  nextServerId: string | null;
};

export type ChannelResult = {
  updatedServerId: string;
};
