import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActivityLogs, recordActivityLog } from "../storage/activity-log-storage";
import { ActivityModule } from "../types";

export function useActivityLogs(roleFilter?: string) {
  const qc = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => getActivityLogs(),
  });

  const recordMutation = useMutation({
    mutationFn: async (params: Parameters<typeof recordActivityLog>[0]) => {
      return recordActivityLog(params);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });

  const logs = useMemo(() => query.data ?? [], [query.data]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchRole = !roleFilter || roleFilter === "all" || log.actorRole === roleFilter;
      const matchModule = selectedModule === "all" || log.module === selectedModule;
      const matchSearch =
        log.actorName.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase());

      return matchRole && matchModule && matchSearch;
    });
  }, [logs, roleFilter, selectedModule, search]);

  return {
    logs: filteredLogs,
    allLogs: logs,
    isLoading: query.isLoading,
    selectedModule,
    setSelectedModule,
    search,
    setSearch,
    recordActivity: recordMutation.mutate,
  };
}
