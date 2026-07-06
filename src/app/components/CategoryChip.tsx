import { LucideIcon } from "lucide-react";

interface CategoryChipProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryChip({
  icon: Icon,
  label,
  active = false,
  onClick,
}: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[80px] transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-card text-foreground hover:bg-accent"
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  );
}
