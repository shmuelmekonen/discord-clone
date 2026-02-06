import { ACTION_ERRORS, USER_MESSAGES } from "@/lib/constants";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/handle-api-error";
import { SOCKET_EVENTS } from "@/lib/routes";
import { NextApiResponseServerIo } from "@/types/socket-types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: USER_MESSAGES.METHOD_NOT_ALLOWED,
      code: ACTION_ERRORS.METHOD_NOT_ALLOWED,
    });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl, fileType } = req.body;
    const { conversationId } = req.query;

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

    if (!content) {
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

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        fileType,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = SOCKET_EVENTS.toKey(conversationId as string);

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log("[DIRECT_MESSAGES_POST]", err);
    return handleApiError(res, err);
  }
}
