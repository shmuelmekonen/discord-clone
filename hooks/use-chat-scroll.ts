import { useEffect, useLayoutEffect, useRef, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const userScrolledUpRef = useRef(false);
  const previousHeightRef = useRef(0);

  // 1. Handle scroll events to trigger data fetching
  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === undefined || !topDiv) return;

      // Trigger load only when reaching the absolute top (0)
      if (scrollTop === 0 && shouldLoadMore && hasInitialized) {
        userScrolledUpRef.current = true;
        previousHeightRef.current = topDiv.scrollHeight;
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);
    return () => topDiv?.removeEventListener("scroll", handleScroll);
  }, [shouldLoadMore, loadMore, chatRef, hasInitialized]);

  // 2. Scroll Retention: Maintain position after loading old messages
  // useLayoutEffect prevents visual jitter by adjusting scroll before paint
  useLayoutEffect(() => {
    const topDiv = chatRef?.current;

    if (topDiv && userScrolledUpRef.current) {
      const newScrollHeight = topDiv.scrollHeight;
      const heightDifference = newScrollHeight - previousHeightRef.current;

      // eslint-disable-next-line
      topDiv.scrollTop = heightDifference;
      userScrolledUpRef.current = false;
    }
  }, [count, chatRef]);

  // 3. Auto-scroll to bottom on init or new message (if near bottom)
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      // Prevent auto-scroll if user manually triggered a history load
      if (userScrolledUpRef.current) return false;

      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) return false;

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      // Threshold for auto-scrolling to new messages
      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "auto",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
