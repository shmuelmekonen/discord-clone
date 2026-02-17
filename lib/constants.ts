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
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
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
  MISSING_PARAMS: "Missing required parameters.",
  METHOD_NOT_ALLOWED: "Method not allowed.",
} as const;

export const TOAST_MESSAGES = {
  SERVER: {
    CREATE_SUCCESS: "Server created successfully!",
    CREATE_ERROR: "Failed to create server",
    UPDATE_SUCCESS: "Server updated successfully!",
    UPDATE_ERROR: "Failed to update server",
    DELETE_SUCCESS: "Server deleted successfully",
    DELETE_ERROR: "Failed to delete server",
    LEAVE_SUCCESS: "You left the server",
    LEAVE_ERROR: "Failed to leave server",
    JOIN_SUCCESS: (name: string) => `Welcome to ${name}'s server!`,
    JOIN_ERROR: "Failed to join server",
    INVITE_GENERATE_ERROR: "Failed to generate a new link",
  },
  CHANNEL: {
    CREATE_SUCCESS: "Channel created successfully!",
    UPDATE_SUCCESS: "Channel updated successfully!",
    UPDATE_ERROR: "Failed to update channel",
    DELETE_SUCCESS: "Channel deleted",
    DELETE_ERROR: "Failed to delete channel",
    NAME_EXISTS: "Channel name already exists.",
  },
  MEMBER: {
    KICK_SUCCESS: "Member kicked",
    ROLE_UPDATE_SUCCESS: "Role updated",
    ACTION_ERROR: "Failed to perform action",
  },
  MESSAGE: {
    SEND_ERROR: "Failed to send message",
    DELETE_ERROR: "Failed to delete message",
    UPDATE_ERROR: "Failed to update message",
    FILE_UPLOAD_ERROR: "Failed to upload file",
  },
} as const;
