"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EcosystemProduct } from "@/lib/types";
import { Package, ExternalLink } from "lucide-react";

const products: EcosystemProduct[] = [
  { slug: "openclaw", name: "OpenClaw", tagline: "AI Agent Runtime", status: "live", stack: ["TypeScript", "Node.js", "LLM APIs"] },
  { slug: "mission-control", name: "Mission Control", tagline: "Agent Dashboard", status: "beta", stack: ["Next.js 15", "Convex", "Tailwind"] },
  { slug: "voice-bridge", name: "Voice Bridge", tagline: "Phone AI Integration", status: "dev", stack: ["Vapi.ai", "Twilio", "ElevenLabs"] },
  { slug: "memory-engine", name: "Memory Engine", tagline: "Persistent Agent Memory", status: "live", stack: ["Markdown", "Convex", "Vector DB"] },
];

const statusVariant = (s: string) => {
  if (s === "live") return "success" as const;
  if (s === "beta") return "warning" as const;
  if (s === "dev") return "default" as const;
  return "secondary" as const;
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } } };

export function EcosystemView() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {products.map((p) => (
        <motion.div key={p.slug} variants={item}>
          <Link href={`/ecosystem/${p.slug}`}>
            <Card className="p-4 hover:bg-white/[0.05] transition-colors cursor-pointer">
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{p.name}</span>
                      <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{p.tagline}</p>
                    {p.stack && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.stack.map((t) => (
                          <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
