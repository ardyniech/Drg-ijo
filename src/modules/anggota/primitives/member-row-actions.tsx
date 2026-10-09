import { Phone, Edit2, Trash2 } from "lucide-react";
import { MemberRecord } from "../types";
import { DigitalKtaModal } from "./digital-kta-modal";

interface Props {
  member: MemberRecord;
  canManage?: boolean;
  onEditMember?: (member: MemberRecord) => void;
  onDeleteMember?: (member: MemberRecord) => void;
}

export function MemberRowActions({ member: m, canManage, onEditMember, onDeleteMember }: Props) {
  return (
    <div className="inline-flex items-center gap-1">
      <a
        href={`https://wa.me/${m.no_hp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-md hover:bg-muted text-primary"
        title="WhatsApp"
      >
        <Phone className="h-3.5 w-3.5" />
      </a>
      <DigitalKtaModal member={m} />
      {canManage && onEditMember && (
        <button
          type="button"
          onClick={() => onEditMember(m)}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Edit Anggota"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      )}
      {canManage && onDeleteMember && (
        <button
          type="button"
          onClick={() => onDeleteMember(m)}
          className="p-1.5 rounded-md hover:bg-rose-500/10 text-rose-500"
          title="Hapus Anggota"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
