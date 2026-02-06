"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { MODAL_TYPES } from "@/lib/constants";
import axios from "axios";
import {
  messageFileSchema,
  MessageFileSchemaType,
} from "@/lib/validations/chat";

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === MODAL_TYPES.MESSAGEFILE;

  const { apiUrl, query } = data;

  const form = useForm<MessageFileSchemaType>({
    resolver: zodResolver(messageFileSchema),
    defaultValues: {
      fileUrl: "",
      fileType: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  // eslint-disable-next-line react-hooks/incompatible-library
  const fileType = form.watch("fileType");

  const onSubmit = async (values: MessageFileSchemaType) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      form.reset();
      router.refresh();
      onClose();
    } catch (err) {
      let errorMessage = "Failed to send file";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="bg-white text-black p-0 overflow-hidden"
        onEscapeKeyDown={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Upload Your Image
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          fileType={fileType}
                          onChange={(url, type) => {
                            if (type) {
                              form.setValue("fileType", type);
                            }
                            field.onChange(url);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                disabled={isLoading}
                className="w-full flex items-center justify-center"
                variant="primary"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4 text-white" />
                ) : (
                  "Send"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
