"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { KnowledgeEntry } from "@/lib/types";
import { Search, FileText, Folder } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export function KnowledgeBase() {
  const [query, setQuery] = useState("");
  const { data, loading } = useApi<KnowledgeEntry[]>(`/api/knowledge${query ? `?q=${encodeURIComponent(query)}` : ""}`, 0);
  const entries = data || [];

  const grouped = entries.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = [];
    acc[e.category].push(e);
    return acc;
  }, {} as Record<string, KnowledgeEntry[]>);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className="pl-9"
        />
      </div>

      {loading && <p className="text-xs text-muted-foreground">Searching...</p>}

      {Object.entries(grouped).map(([category, catEntries]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-3.5 h-3.5" /> {category}
            </CardTitle>
            <Badge variant="secondary">{catEntries.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {catEntries.map((e) => (
                <div key={e.path} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{e.title}</span>
                      <span className="text-[9px] text-muted-foreground">{e.path}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{e.excerpt}</p>
                  </div>
                  <span className="text-[9px] text-muted-foreground shrink-0">{formatRelativeTime(e.modifiedAt)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {entries.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No results found</p>
        </div>
      )}
    </motion.div>
  );
}
