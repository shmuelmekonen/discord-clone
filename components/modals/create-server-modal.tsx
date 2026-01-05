"use client";

import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { createServer } from "@/actions/server-actions";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useServerNavigationStore } from "@/hooks/use-server-navigation-store";

interface ServerModalProps {
  isInitial?: boolean;
  profileId?: string;
}

export const CreateServerModal = ({
  profileId,
  isInitial = false,
}: ServerModalProps) => {
  const { dispatchOptimistic, clearAction } = useServerNavigationStore();

  const [isMounted, setIsMounted] = useState(false);

  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isInitial ? true : isOpen && type === "createServer";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<ServerSchemaType>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const onSubmit = async (values: ServerSchemaType) => {
    const tempId = `temp-${Date.now()}`;

    startTransition(async () => {
      try {
        dispatchOptimistic(tempId, {
          type: "CREATE",
          server: {
            id: tempId,
            name: values.name,
            imageUrl: values.imageUrl,
            profileId: profileId || "",
            inviteCode: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        onClose();
        form.reset();

        const { data: server, error } = await createServer(values);

        if (error) {
          toast.error(error);
          return;
        }

        if (!server?.id) {
          router.refresh();
          toast.info("Changes saved! We're updating your view...", {
            duration: 3000,
          });
          return;
        }

        form.reset();
        router.push(`/servers/${server.id}`);
      } catch (error) {
        toast.error("Failed to create server");
      } finally {
        clearAction(tempId);
      }
    });
  };

  const handleClose = () => {
    if (isInitial) return;
    form.reset();
    onClose();
  };

  // מניעת שגיאות Hydration
  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create your server
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
