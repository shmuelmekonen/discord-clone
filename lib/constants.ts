export const CHANNEL_NAMES = {
  GENERAL: "general",
} as const;

export const MODAL_TYPES = {
  CREATE_SERVER: "createServer",
  INVITE: "invite",
  EDIT_SERVER: "editServer",
  MANAGE_MEMBERS: "manageMembers",
  CREATE_CHANNEL: "createChannel",
  LEAVE_SERVER: "leaveServer",
  DELETE_SERVER: "deleteServer",
  DELETE_CHANNEL: "deleteChannel",
  EDIT_CHANNEL: "editChannel",
  MESSAGEFILE: "messageFile",
  DELETE_MESSAGE: "deleteMessage",
} as const;

export const ALLOWED_IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "webp"];

export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  INVITE: "/invite",
  SERVERS: "/servers",
} as const;

export const ACTION_ERRORS = {
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DB_ERROR: "DB_ERROR",
  INVALID_PARAMETERS: "INVALID_PARAMETERS",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
} as const;

export const USER_MESSAGES = {
  GENERIC_ERROR: "Something went wrong. Please try again later.",
  UNAUTHORIZED: "You must be logged in to perform this action.",
  VALIDATION_ERROR: "Invalid data provided",
  NOT_FOUND:
    "The requested resource was not found or you don't have permission.",
  CONFLICT: "This record already exists.",
  INVITE_NOT_FOUND: "This invite code is invalid or has expired.",
  ALREADY_MEMBER: "You are already a member of this server.",
} as const;

// export const VALIDATION_LIMITS = {
//   NAME_MIN: 1,
//   NAME_MAX: 32,
//   IMAGE_MAX_SIZE: "4MB",
// } as const;
