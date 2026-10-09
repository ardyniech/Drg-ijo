import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Network, Maximize2, RefreshCw } from "lucide-react";

export function ArchitectureCanvasModal() {
  const [activeCanvas, setActiveCanvas] = useState<"jaga" | "santui">("jaga");
  const [reloadKey, setReloadKey] = useState(0);

  const canvasUrl =
    activeCanvas === "jaga"
      ? "/about/architecture/jaga-satu-aspal-workflow.html?embed=1&theme=light"
      : "/about/architecture/drg-satu-aspal-santui.html?embed=1&theme=light";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2 text-xs">
          <Network className="h-4 w-4 text-primary" />
          <span>Buka Kanvas Arsitektur Interaktif</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] p-4 flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/70">
          <div>
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" /> Visualisasi Arsitektur & Alur Lapangan
            </DialogTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Diagram alur operasional hidup yang di-render dari model archify sistem.
            </p>
          </div>
          <div className="flex items-center gap-2 pr-6">
            <div className="flex rounded-lg bg-muted p-0.5 text-xs">
              <button
                onClick={() => setActiveCanvas("jaga")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  activeCanvas === "jaga"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                Workflow Jaga Jalur
              </button>
              <button
                onClick={() => setActiveCanvas("santui")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  activeCanvas === "santui"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                Arsitektur Sistem
              </button>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <a href={canvasUrl.replace("&embed=1", "")} target="_blank" rel="noreferrer">
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>
        </DialogHeader>

        <div className="flex-1 w-full rounded-xl overflow-hidden border border-border/60 bg-muted/20 relative mt-2">
          <iframe
            key={`${activeCanvas}-${reloadKey}`}
            src={canvasUrl}
            title="Interactive Architecture Canvas"
            className="w-full h-full border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
