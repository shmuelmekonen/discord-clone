"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { MODAL_TYPES } from "@/lib/constants";

export const CreateServerModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === MODAL_TYPES.CREATE_SERVER;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (isLoading) return;

    try {
      const result = await createServer(values);
      const { data: server, error } = result;

      if (error) {
        toast.error(error);
        return;
      }

      if (!server) {
        onClose();
        router.refresh();
        toast.info("Changes saved! We're updating your view...", {
          duration: 3000,
        });
        return;
      }

      form.reset();
      router.refresh();
      onClose();
      router.push(`/servers/${server.id}`);
      toast.success("Server created successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create server");
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="bg-white text-black p-0 overflow-hidden w-[95vw] max-w-[425px]"
        onEscapeKeyDown={(e) => {
          if (isLoading) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (isLoading) e.preventDefault();
        }}
      >
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-8"
          >
            <div className="space-y-4 md:space-y-8 px-4 md:px-6">
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
                        className="bg-zinc-200 dark:bg-zinc-200 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-zinc-500"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-200 px-6 py-4">
              <Button
                disabled={isLoading}
                className="w-full flex items-center justify-center"
                variant="primary"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4 text-white" />
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
