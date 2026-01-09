import { ACTION_ERRORS } from "@/lib/constants";

export type ActionErrorCode =
  (typeof ACTION_ERRORS)[keyof typeof ACTION_ERRORS];

export type ActionResponse<T> = {
  data: T | null;
  error: string | null;
  code?: ActionErrorCode;
  validationErrors?: Record<string, string[]>;
};
