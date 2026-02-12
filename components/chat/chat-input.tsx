"use client";

import axios from "axios";
import qs from "query-string";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Plus, SendHorizontal } from "lucide-react";

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
      setTimeout(() => {
        form.setFocus("content");
      }, 10);
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
                  <div className="absolute top-7 left-8 flex items-center gap-x-2 z-10">
                    <button
                      type="button"
                      onClick={() =>
                        onOpen(MODAL_TYPES.MESSAGEFILE, { apiUrl, query })
                      }
                      className="h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                  <Input
                    disabled={isLoading}
                    className="pl-24 pr-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base md:text-sm"
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <button
                      type="submit"
                      className="hover:opacity-75 transition text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      disabled={isLoading}
                    >
                      <SendHorizontal className="h-6 w-6" />
                    </button>
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
