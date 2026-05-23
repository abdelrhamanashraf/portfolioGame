import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  icon: string;
  children: ReactNode;
}

const InfoDialog = ({ open, onOpenChange, title, icon, children }: InfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(25_25%_15%)] border-2 border-primary/60 max-w-lg font-retro shadow-[0_0_40px_hsl(40_70%_55%/0.2)]">
        <DialogHeader>
          <DialogTitle className="font-pixel text-primary text-sm flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="text-foreground text-lg leading-relaxed space-y-3">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
