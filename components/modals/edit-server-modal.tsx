"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { FileUpload } from "@/components/file-upload";

import { serverSchema, ServerSchemaType } from "@/lib/validations/server";
import { editServer } from "@/actions/server-actions";
import { useModal } from "@/hooks/use-modal-store";
import { useServerNavigationStore } from "@/hooks/use-server-navigation-store";
import { toast } from "sonner";

export const EditServerModal = () => {
  const { dispatchOptimistic, clearAction } = useServerNavigationStore();

  const [isMounted, setIsMounted] = useState(false);

  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "editServer";

  const { server } = data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<ServerSchemaType>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: server?.name,
      imageUrl: server?.imageUrl,
    },
  });

  useEffect(() => {
    if (isModalOpen && server) {
      form.reset({
        name: server.name,
        imageUrl: server.imageUrl,
      });
    }
  }, [server, form, isModalOpen]);

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const onSubmit = async (values: ServerSchemaType) => {
    const serverId = server?.id;
    if (!serverId || !server) return;

    startTransition(async () => {
      try {
        dispatchOptimistic(serverId, {
          type: "UPDATE",
          server: { ...server, ...values },
        });
        onClose();

        const { data: editedServer, error } = await editServer(
          serverId,
          values
        );

        if (error) {
          toast.error(error);
          return;
        }

        if (!editedServer?.id) {
          router.refresh();
          toast.info("Changes saved! We're updating your view...", {
            duration: 3000,
          });
          return;
        }
        router.push(`/servers/${editedServer.id}`);
      } catch (err) {
        toast.error("An unexpected error occurred.");
      } finally {
        clearAction(serverId);
      }
    });
  };

  const handleClose = () => {
    if (server) {
      form.reset();
    }
    onClose();
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
