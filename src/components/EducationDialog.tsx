import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EDUCATION = {
  degree: "Bachelor's Degree in International Foreign Trade",
  university: "English Department — Helwan University • Cairo",
  year: "2015-2019"
};

const CERTIFICATIONS = [
  { name: "CS50x — Introduction to Computer Science", issuer: "Harvard University", year: "2022" },
  { name: "Advanced Full-Stack Web Nanodegree", issuer: "Udacity", year: "2022" },
  { name: "Full-Stack Web Development", issuer: "Udemy", year: "2023" },
  { name: "Web Development Bootcamp", issuer: "DEPI", year: "2024" },
  { name: "CCNA — Networking Basics", issuer: "Cisco", year: "2023" },
  { name: "Oracle Database Administration", issuer: "Oracle", year: "2025" },
  { name: "Oracle MiddleWare Administration", issuer: "Oracle", year: "2025" },
];

const EducationDialog = ({ open, onOpenChange }: EducationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(25_25%_15%)] border-2 border-primary/60 max-w-lg font-retro shadow-[0_0_40px_hsl(40_70%_55%/0.2)]">
        <DialogHeader>
          <DialogTitle className="font-pixel text-primary text-sm flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            EDUCATION
          </DialogTitle>
        </DialogHeader>

        <div className="text-foreground text-lg leading-relaxed space-y-4">
          {/* Degree Card */}
          <div className="bg-muted/50 p-4 rounded border border-border relative overflow-hidden">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/40" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/40" />

            <h3 className="font-pixel text-[11px] text-primary mb-2">
              📜 {EDUCATION.degree}
            </h3>
            <div className="space-y-1 text-base">
              <p>
                <span className="text-muted-foreground">🏛️ University:</span>{" "}
                {EDUCATION.university}
              </p>
              <p>
                <span className="text-muted-foreground">📅 Period:</span>{" "}
                {EDUCATION.year}
              </p>

            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-pixel text-[11px] text-primary mb-2">
              🏅 CERTIFICATIONS
            </h3>
            <div className="space-y-2">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-start gap-3 bg-muted/30 p-2 rounded border border-border hover:border-primary/40 transition-colors"
                >
                  <span className="text-primary mt-0.5 text-sm">✦</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{cert.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EducationDialog;
