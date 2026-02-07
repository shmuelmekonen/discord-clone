"use client";

import axios from "axios";
import qs from "query-string";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Plus } from "lucide-react";

import { chatInputSchema, ChatInputSchemaType } from "@/lib/validations/chat";
import { useModal } from "@/hooks/use-modal-store";
import { MODAL_TYPES } from "@/lib/constants";
import EmojiPicker from "@/components/chat/emoji-picker";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, string>;
  name: string;
  type: "conversation" | "channel";
}

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();

  const form = useForm<ChatInputSchemaType>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: ChatInputSchemaType) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);

      form.reset();
      form.setFocus("content");
    } catch (err) {
      console.log(err);

      let errorMessage = "Could not send message";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() =>
                      onOpen(MODAL_TYPES.MESSAGEFILE, { apiUrl, query })
                    }
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-desc hover:bg-desc transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-input border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-header placeholder:text-desc"
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
