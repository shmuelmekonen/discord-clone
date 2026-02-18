import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

import { cn } from "@/lib/utils";

import { Toaster } from "sonner";

import "./globals.css";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SocketEventProvider } from "@/components/providers/socket-event-provider";

const font = Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nexus | Real-time Chat",
  description: "Seamless team communication platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body className={cn(font.className, "antialiased", "bg-main")}>
          {/* שינוי: הזזת ה-Plugin לכאן (מעל ה-ThemeProvider) */}
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="nexus-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                <SocketEventProvider>{children}</SocketEventProvider>
              </QueryProvider>
              <Toaster richColors position="bottom-right" />
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
