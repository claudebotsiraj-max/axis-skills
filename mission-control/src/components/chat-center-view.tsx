"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useApi } from "@/hooks/use-api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VoiceInput } from "@/components/voice-input";
import type { ChatMessage, ChatSession } from "@/lib/types";
import { Send, MessageSquare, Hash } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";

export function ChatCenterView() {
  const [selectedSession, setSelectedSession] = useState<string>("s1");
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data } = useApi<{ sessions: ChatSession[]; messages?: ChatMessage[] }>(
    `/api/chat-history?session=${selectedSession}`,
    10000
  );

  const sessions = data?.sessions || [];
  const apiMessages = data?.messages || [];
  const allMessages = [...apiMessages, ...localMessages];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
      channel: "webchat",
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setMessage("");

    await fetch("/api/chat-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, channel: "webchat" }),
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 h-[calc(100vh-160px)]">
      {/* Session sidebar */}
      <Card className="w-64 shrink-0 p-3 overflow-y-auto">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-3">Sessions</div>
        <div className="space-y-1">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSelectedSession(s.id); setLocalMessages([]); }}
              className={cn(
                "w-full text-left p-2.5 rounded-lg transition-colors",
                selectedSession === s.id ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium truncate">{s.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[8px]">
                  <Hash className="w-2 h-2 mr-0.5" />{s.channel}
                </Badge>
                <span className="text-[9px] text-muted-foreground">{formatRelativeTime(s.updatedAt)}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="text-sm font-medium">
            {sessions.find((s) => s.id === selectedSession)?.title || "Chat"}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {allMessages.map((m) => (
            <div
              key={m.id}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-3.5 py-2.5 text-xs",
                  m.role === "user"
                    ? "bg-primary/10 text-foreground rounded-br-md"
                    : "bg-white/[0.04] rounded-bl-md"
                )}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                <div className="text-[9px] text-muted-foreground mt-1 text-right">
                  {new Date(m.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <VoiceInput onTranscript={(t) => setMessage((prev) => prev + t)} />
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button size="icon" onClick={sendMessage} disabled={!message.trim()}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function CommandView() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([
    "$ openclaw gateway status",
    "Gateway running on port 3001",
    "Connected agents: 1",
    "Uptime: 4h 23m",
    "",
    "Ready for commands...",
  ]);

  const handleCommand = async () => {
    if (!command.trim()) return;
    setOutput((prev) => [...prev, `$ ${command}`, "Command queued for execution..."]);
    await fetch("/api/chat-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `/${command}`, channel: "command" }),
    });
    setCommand("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="h-[calc(100vh-160px)] flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto font-mono">
          {output.map((line, i) => (
            <div key={i} className={cn("text-xs", line.startsWith("$") ? "text-primary" : "text-muted-foreground")}>
              {line || "\u00A0"}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs font-mono">$</span>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommand()}
              placeholder="Enter command..."
              className="flex-1 font-mono"
            />
            <Button size="sm" onClick={handleCommand}>Run</Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
