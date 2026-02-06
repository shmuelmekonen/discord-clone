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
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      });
    }

    if (!serverId) {
      return res.status(400).json({
        error: USER_MESSAGES.MISSING_PARAMS,
        code: ACTION_ERRORS.INVALID_PARAMETERS,
      });
    }

    if (!channelId) {
      return res.status(400).json({
        error: USER_MESSAGES.MISSING_PARAMS,
        code: ACTION_ERRORS.INVALID_PARAMETERS,
      });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({
        error: USER_MESSAGES.NOT_FOUND,
        code: ACTION_ERRORS.NOT_FOUND,
      });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({
        error: USER_MESSAGES.NOT_FOUND,
        code: ACTION_ERRORS.NOT_FOUND,
      });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return res.status(404).json({
        error: USER_MESSAGES.NOT_FOUND,
        code: ACTION_ERRORS.NOT_FOUND,
      });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({
        error: USER_MESSAGES.NOT_FOUND,
        code: ACTION_ERRORS.NOT_FOUND,
      });
    }

    const isMessageOwner = message.memberId === member.id;
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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

    const updateKey = SOCKET_EVENTS.toUpdateKey(channelId as string);

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (err) {
    console.log("[MESSAGE_ID]", err);
    return handleApiError(res, err);
  }
}
