"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { ChatCenterView, CommandView } from "@/components/chat-center-view";

const tabs = [
  { id: "chat", label: "Chat" },
  { id: "command", label: "Command" },
];

function ChatContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "chat";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Chat</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Agent conversations & commands</p>
      </div>
      <TabBar tabs={tabs} layoutId="chat-tabs" />
      {tab === "chat" && <ChatCenterView />}
      {tab === "command" && <CommandView />}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  );
}
