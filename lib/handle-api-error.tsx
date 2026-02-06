import { NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { ACTION_ERRORS, USER_MESSAGES } from "@/lib/constants";

export function handleApiError(res: NextApiResponse, error: unknown) {
  console.error("[API_ERROR]", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: USER_MESSAGES.NOT_FOUND,
        code: ACTION_ERRORS.NOT_FOUND,
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        error: USER_MESSAGES.CONFLICT,
        code: ACTION_ERRORS.CONFLICT,
      });
    }
  }

  return res.status(500).json({
    error: USER_MESSAGES.GENERIC_ERROR,
    code: ACTION_ERRORS.INTERNAL_ERROR,
  });
}
