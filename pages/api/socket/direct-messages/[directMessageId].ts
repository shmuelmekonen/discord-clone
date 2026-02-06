import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/socket-types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { ACTION_ERRORS, USER_MESSAGES } from "@/lib/constants";
import { handleApiError } from "@/lib/handle-api-error";
import { SOCKET_EVENTS } from "@/lib/routes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({
      error: USER_MESSAGES.METHOD_NOT_ALLOWED,
      code: ACTION_ERRORS.METHOD_NOT_ALLOWED,
    });
  }

  try {
    const profile = await currentProfilePages(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        error: USER_MESSAGES.MISSING_PARAMS,
        code: ACTION_ERRORS.INVALID_PARAMETERS,
      });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        error: USER_MESSAGES.NOT_FOUND,
        code: ACTION_ERRORS.NOT_FOUND,
      });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({
        error: USER_MESSAGES.NOT_FOUND,
        code: ACTION_ERRORS.NOT_FOUND,
      });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({
        error: USER_MESSAGES.NOT_FOUND,
        code: ACTION_ERRORS.NOT_FOUND,
      });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          fileType: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({
          error: USER_MESSAGES.UNAUTHORIZED,
          code: ACTION_ERRORS.UNAUTHORIZED,
        });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    const updateKey = SOCKET_EVENTS.toUpdateKey(conversationId as string);

    res?.socket?.server?.io?.emit(updateKey, directMessage);
    return res.status(200).json(directMessage);
  } catch (err) {
    console.log("[MESSAGE_ID]", err);
    return handleApiError(res, err);
  }
}
