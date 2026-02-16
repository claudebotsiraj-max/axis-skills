"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EcosystemProduct } from "@/lib/types";
import { ArrowLeft, ExternalLink, Package } from "lucide-react";
import Link from "next/link";

const statusVariant = (s: string) => {
  if (s === "live") return "success" as const;
  if (s === "beta") return "warning" as const;
  if (s === "dev") return "default" as const;
  return "secondary" as const;
};

export default function EcosystemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, loading } = useApi<EcosystemProduct>(`/api/ecosystem/${slug}`);

  if (loading) {
    return <div className="text-xs text-muted-foreground">Loading...</div>;
  }

  if (!data) {
    return <div className="text-xs text-muted-foreground">Product not found</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <Link href="/knowledge?tab=ecosystem">
        <Button variant="ghost" size="sm" className="gap-1.5">
          <ArrowLeft className="w-3 h-3" /> Back to Ecosystem
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold normal-case tracking-normal">{data.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{data.tagline}</p>
            </div>
          </div>
          <Badge variant={statusVariant(data.status)}>{data.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.description && (
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Description</div>
              <p className="text-xs leading-relaxed">{data.description}</p>
            </div>
          )}
          {data.stack && data.stack.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {data.stack.map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
            </div>
          )}
          {data.url && (
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">URL</div>
              <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                {data.url} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
