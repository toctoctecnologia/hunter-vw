import { Plus } from "lucide-react";
import { useState } from "react";
import { AddUserModal } from "./AddUserModal";

export function AddUserButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Adicionar usuário"
        className="inline-flex items-center gap-3 h-16 px-8 rounded-3xl bg-[hsl(var(--accent))] text-white text-[30px] hover:bg-[#e65c00] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--accent))]/40 transition-colors whitespace-nowrap"
      >
        <Plus className="h-6 w-6" />
        <span>Novo usuário</span>
      </button>
      <AddUserModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
