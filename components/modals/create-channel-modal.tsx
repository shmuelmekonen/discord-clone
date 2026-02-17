"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { channelSchema, ChannelSchemaType } from "@/lib/validations/server";
import { createChannel } from "@/actions/channel-actions";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";
import {
  ACTION_ERRORS,
  MODAL_TYPES,
  TOAST_MESSAGES,
  USER_MESSAGES,
} from "@/lib/constants";
import { useSocket } from "@/components/providers/socket-provider";
import { SOCKET_EVENTS } from "@/lib/routes";

export const CreateChannelModal = () => {
  const { socket } = useSocket();

  const [isMounted, setIsMounted] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { isOpen, onClose, type, data } = useModal();
  const { server, channelType } = data;
  const isModalOpen = isOpen && type === MODAL_TYPES.CREATE_CHANNEL;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const form = useForm<ChannelSchemaType>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      form.reset({
        name: "",
        type: channelType || ChannelType.TEXT,
      });
    }
  }, [isModalOpen, channelType, form, form.reset]);

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const onSubmit = async (values: ChannelSchemaType) => {
    try {
      setGeneralError(null);
      const serverId = server?.id;
      if (!serverId) {
        setGeneralError(USER_MESSAGES.GENERIC_ERROR);
        return;
      }

      const result = await createChannel(serverId, values);
      const { data, error, code } = result;

      if (!data) {
        if (code === ACTION_ERRORS.CONFLICT) {
          form.setError("name", {
            message: TOAST_MESSAGES.CHANNEL.NAME_EXISTS,
          });
          return;
        }
        setGeneralError(error || USER_MESSAGES.GENERIC_ERROR);
        return;
      }
      const { updatedServerId, channelId } = data;

      toast.success(TOAST_MESSAGES.CHANNEL.CREATE_SUCCESS);
      socket?.emit(SOCKET_EVENTS.SERVER_UPDATE, serverId);

      form.reset();
      onClose();
      router.refresh();
      router.push(`/servers/${updatedServerId}/channels/${channelId}`);
    } catch (err) {
      console.log(err);
      setGeneralError(USER_MESSAGES.GENERIC_ERROR);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden w-[95vw] max-w-[425px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-8"
          >
            <div className="space-y-4 md:space-y-8 px-4 md:px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-desc">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-200 dark:bg-zinc-200 border-0 focus-visible:ring-0 text-black placeholder:text-zinc-500 focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-desc">
                      Channel Type
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-zinc-100/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {generalError && (
              <div className="mx-6 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 text-center">
                {generalError}
              </div>
            )}

            <DialogFooter className="bg-gray-200 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
