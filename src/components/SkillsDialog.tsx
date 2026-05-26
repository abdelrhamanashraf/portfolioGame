import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SkillsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SKILL_CATEGORIES = [
  {
    title: "Languages",
    color: "#f97316",
    skills: [
      { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
      { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
      { name: "Bash", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" },
      { name: "PowerShell", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powershell/powershell-original.svg" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    color: "#3b82f6",
    skills: [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
      { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
      { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
      { name: "Angular", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
      { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
      { name: "jQuery", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg" },
      { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    ],
  },
  {
    title: "Databases",
    color: "#ef4444",
    skills: [
      { name: "Oracle", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "SQLite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
      { name: "MS SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" },
      { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
    ],
  },
  {
    title: "Cloud & DevOps",
    color: "#8b5cf6",
    skills: [
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
      { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
      { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
      { name: "GCP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
      { name: "CircleCI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/circleci/circleci-plain.svg" },
    ],
  },
  {
    title: "Automation & Tools",
    color: "#10b981",
    skills: [
      { name: "n8n", emoji: "⚡" },
      { name: "OpenClaw", emoji: "🤖" },
      { name: "Selenium", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg" },
      { name: "Puppeteer", emoji: "🎭" },
      { name: "Postman", emoji: "📮" },
      { name: "WebLogic", emoji: "🔧" },
      { name: "Nginx", emoji: "🌐" },
      { name: "Jinja", emoji: "🧩" },
    ],
  },
];

const SkillsDialog = ({ open, onOpenChange }: SkillsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[85vh] overflow-y-auto border-2"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          borderColor: "hsl(25 55% 35%)",
          color: "#e2e8f0",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-center text-2xl font-bold tracking-wide"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "16px",
              background: "linear-gradient(90deg, #f97316, #ef4444, #8b5cf6, #3b82f6, #10b981)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            🛠️ SKILLS & TECHNOLOGIES
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <h3
                className="text-sm font-bold uppercase tracking-widest mb-3 pb-1"
                style={{
                  color: cat.color,
                  borderBottom: `2px solid ${cat.color}33`,
                  fontFamily: "'VT323', monospace",
                  fontSize: "18px",
                }}
              >
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group flex flex-col items-center gap-1.5 p-3 rounded-lg cursor-default transition-all duration-200 hover:scale-110 hover:shadow-lg"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      minWidth: 72,
                    }}
                    title={skill.name}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-md transition-all group-hover:shadow-md"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                      }}
                    >
                      {"icon" in skill && skill.icon ? (
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="w-7 h-7 object-contain"
                          style={{ filter: skill.name === "Express" || skill.name === "Next.js" ? "invert(1)" : undefined }}
                        />
                      ) : (
                        <span className="text-2xl">{"emoji" in skill ? skill.emoji : "🔹"}</span>
                      )}
                    </div>
                    <span
                      className="text-xs text-center leading-tight"
                      style={{
                        color: "#94a3b8",
                        fontFamily: "'VT323', monospace",
                        fontSize: "14px",
                      }}
                    >
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsDialog;
