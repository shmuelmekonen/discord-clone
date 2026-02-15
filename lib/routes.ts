export const APP_PATHS = {
  server: (serverId: string) => `/servers/${serverId}`,

  channel: (serverId: string, channelId: string) =>
    `/servers/${serverId}/channels/${channelId}`,

  member: (serverId: string, memberId: string) =>
    `/servers/${serverId}/conversations/${memberId}`,
} as const;

/**
 * Centralized Socket.IO event names.
 * Functions are used for dynamic namespaces (specific to ID),
 * Strings are used for static triggers.
 */
export const SOCKET_EVENTS = {
  toKey: (chatId: string) => `chat:${chatId}:messages`,
  toUpdateKey: (chatId: string) => `chat:${chatId}:messages:update`,

  serverUpdated: (serverId: string) => `server:${serverId}:updated`,

  serverDeleted: (serverId: string) => `server:${serverId}:deleted`,

  memberKicked: (memberId: string) => `member:${memberId}:kicked`,

  SERVER_UPDATE: "server:update",
  SERVER_DELETE: "server:delete",
  MEMBER_KICK: "member:kick",
} as const;
