import { useState } from "react";
import { Sparkles, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSafetyIntelligence } from "./use-safety-intelligence";
import { AnalysisResultCard } from "./analysis-result-card";

export function SafetyIntelligenceDialog() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("Jl. Soekarno-Hatta, Lowokwaru");
  const [category, setCategory] = useState("Mogok Mesin / Jalur Rawan");
  const [description, setDescription] = useState("Rantai putus saat hujan lebat di tikungan.");
  const { isAnalyzing, analysis, analyzeIncident } = useSafetyIntelligence();

  const handleRun = () => {
    analyzeIncident({ location, category, description });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl text-xs font-semibold border-primary/30 text-primary hover:bg-primary/5"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span>AI Dispatching Satgas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">AI Safety & Dispatching</DialogTitle>
              <DialogDescription className="text-xs">
                Analisis kegawatan insiden & panduan evakuasi satgas satu aspal.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Lokasi Kejadian</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 h-8 text-xs rounded-lg"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Kategori Masalah</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 h-8 text-xs rounded-lg"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Situasi / Kondisi Lapangan</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[60px] text-xs rounded-lg"
            />
          </div>

          <Button
            onClick={handleRun}
            disabled={isAnalyzing}
            className="w-full gap-2 rounded-xl text-xs font-semibold"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menganalisis Jalur...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Minta Arahan AI Satgas</span>
              </>
            )}
          </Button>

          {analysis && <AnalysisResultCard analysis={analysis} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
