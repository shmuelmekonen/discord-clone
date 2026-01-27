import { Prisma } from "@prisma/client";
import { ACTION_ERRORS, USER_MESSAGES } from "@/lib/constants";
import { ActionResponse } from "@/types";

type ErrorOverrides = {
  notFound?: string;
  conflict?: string;
};

export function handleServerActionError<T>(
  error: unknown,
  overrides?: ErrorOverrides,
): ActionResponse<T> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025: Record not found (or user lacks permissions due to 'where' clause constraints)
    if (error.code === "P2025") {
      // If a custom message was provided in 'overrides', use it. Otherwise, fallback to the default generic message.
      return {
        data: null,
        error: overrides?.notFound || USER_MESSAGES.NOT_FOUND,
        code: ACTION_ERRORS.NOT_FOUND,
      };
    }

    // P2002: Unique constraint violation (Record already exists)
    if (error.code === "P2002") {
      // Same logic: Use the custom conflict message if available, otherwise fallback to the default one.
      return {
        data: null,
        error: overrides?.conflict || USER_MESSAGES.CONFLICT,
        code: ACTION_ERRORS.CONFLICT,
      };
    }
  }

  return {
    data: null,
    error: USER_MESSAGES.GENERIC_ERROR,
    code: ACTION_ERRORS.INTERNAL_ERROR,
  };
}
