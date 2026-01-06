// 1. שמות שמורים במערכת
export const CHANNEL_NAMES = {
  GENERAL: "general",
} as const;

// 2. סוגי פעולות לאופטימיות (Reducer Actions)
export const OPTIMISTIC_ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  REMOVE: "REMOVE",
  KICK: "KICK",
  MODIFY_ROLE: "MODIFY_ROLE",
} as const;

// 3. סוגי המודאלים (כדי למנוע שגיאות הקלדה ב-onOpen)
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

// // 4. מגבלות ולידציה (כך שאם תחליט לשנות מ-32 ל-50, תשנה במקום אחד)
// export const VALIDATION_LIMITS = {
//   NAME_MIN: 1,
//   NAME_MAX: 32,
//   IMAGE_MAX_SIZE: "4MB",
// } as const;

// 5. נתיבים קבועים (Routes)
export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  INVITE: "/invite",
  SERVERS: "/servers",
} as const;
