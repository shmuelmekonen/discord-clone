export const APP_PATHS = {
  server: (serverId: string) => `/servers/${serverId}`,
  channel: (serverId: string, channelId: string) =>
    `/servers/${serverId}/channels/${channelId}`,
  member: (serverId: string, memberId: string) =>
    `/servers/${serverId}/conversations/${memberId}`,
} as const;

export const SOCKET_EVENTS = {
  toKey: (chatId: string) => `chat:${chatId}:messages`,
  toUpdateKey: (chatId: string) => `chat:${chatId}:messages:update`,
} as const;
