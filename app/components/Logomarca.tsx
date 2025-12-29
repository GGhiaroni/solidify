import { Trophy } from "lucide-react";

export default function Logomarca() {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-extrabold text-soft tracking-tighter flex items-center gap-2">
        solidify
        <span>
          <Trophy className="text-soft" size={24} />
        </span>
      </h1>
    </div>
  );
}
