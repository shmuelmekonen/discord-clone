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
    const { serverId, channelId } = req.query;

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

    if (!content) {
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

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        fileType,
        channelId: channelId as string,
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

    const channelKey = SOCKET_EVENTS.toKey(channelId as string);

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log("[MESSAGES_POST]", err);
    return handleApiError(res, err);
  }
}
