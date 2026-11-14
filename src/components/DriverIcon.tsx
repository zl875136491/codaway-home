import { BrainCircuit, Code2, Cpu, Sparkles, Terminal } from "lucide-react";
import type { DriverKey } from "../data/codaway";

interface DriverIconProps {
  driver: DriverKey;
  size?: number;
}

export function DriverIcon({ driver, size = 14 }: DriverIconProps) {
  switch (driver) {
    case "CODEX":
      return <Code2 size={size} strokeWidth={2} />;
    case "CLAUDE_CODE":
      return <Sparkles size={size} strokeWidth={2} />;
    case "OPENCODE":
      return <Cpu size={size} strokeWidth={2} />;
    case "DEEPSEEK_TUI":
      return <BrainCircuit size={size} strokeWidth={2} />;
    case "SHELL":
      return <Terminal size={size} strokeWidth={2} />;
  }
}
