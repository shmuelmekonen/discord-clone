"use client";

import { CHANNEL_NAMES, MODAL_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};
const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-input transition mb-1",
        params?.channelId === channel.id && "bg-input",
      )}
    >
      <Icon className="shrink-0 w-5 h-5 text-desc" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-desc group-hover:text-header transition",
          params?.channelId === channel.id && "text-primary",
        )}
      >
        {channel.name}
      </p>
      {channel.name !== CHANNEL_NAMES.GENERAL && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, MODAL_TYPES.EDIT_CHANNEL)}
              className="hidden group-hover:block w-4 h-4 text-desc hover:text-header transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, MODAL_TYPES.DELETE_CHANNEL)}
              className="hidden group-hover:block w-4 h-4 text-desc hover:text-header transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === CHANNEL_NAMES.GENERAL && (
        <Lock className="ml-auto w-4 h-4 text-desc" />
      )}
    </button>
  );
};

export default ServerChannel;
