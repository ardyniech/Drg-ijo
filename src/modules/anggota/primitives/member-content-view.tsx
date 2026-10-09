import { MemberDirectoryGrid } from "./member-directory-grid";
import { MemberTableView } from "./member-table-view";
import { MemberRecord, MemberViewMode } from "../types";

interface Props {
  viewMode: MemberViewMode;
  members: MemberRecord[];
  isLoading: boolean;
  onResetFilters: () => void;
  onSelectMember: (m: MemberRecord) => void;
  onVerifyMember: (id: string) => void;
  canVerify: boolean;
  canManage: boolean;
  onEditMember: (m: MemberRecord) => void;
  onDeleteMember: (m: MemberRecord) => void;
}

export function MemberContentView({
  viewMode,
  members,
  isLoading,
  onResetFilters,
  onSelectMember,
  onVerifyMember,
  canVerify,
  canManage,
  onEditMember,
  onDeleteMember,
}: Props) {
  if (viewMode === "table") {
    return (
      <MemberTableView
        members={members}
        isLoading={isLoading}
        onResetFilters={onResetFilters}
        onSelectMember={onSelectMember}
        onVerifyMember={onVerifyMember}
        canVerify={canVerify}
        canManage={canManage}
        onEditMember={onEditMember}
        onDeleteMember={onDeleteMember}
      />
    );
  }

  return (
    <MemberDirectoryGrid
      members={members}
      isLoading={isLoading}
      onResetFilters={onResetFilters}
      onSelectMember={onSelectMember}
      onVerifyMember={onVerifyMember}
      canVerify={canVerify}
      canManage={canManage}
      onEditMember={onEditMember}
      onDeleteMember={onDeleteMember}
    />
  );
}
