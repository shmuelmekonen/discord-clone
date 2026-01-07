export const CHANNEL_NAMES = {
  GENERAL: "general",
} as const;

export const OPTIMISTIC_ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  REMOVE: "REMOVE",
  KICK: "KICK",
  MODIFY_ROLE: "MODIFY_ROLE",
} as const;

export const MODAL_TYPES = {
  CREATE_SERVER: "createServer",
  INVITE: "invite",
  EDIT_SERVER: "editServer",
  MANAGE_MEMBERS: "manageMembers",
  CREATE_CHANNEL: "createChannel",
  LEAVE_SERVER: "leaveServer",
  DELETE_SERVER: "deleteServer",
  JOIN_SERVER: "joinServer",
} as const;

export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  INVITE: "/invite",
  SERVERS: "/servers",
} as const;

export const ACTION_ERRORS = {
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DB_ERROR: "DB_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

// export const VALIDATION_LIMITS = {
//   NAME_MIN: 1,
//   NAME_MAX: 32,
//   IMAGE_MAX_SIZE: "4MB",
// } as const;
