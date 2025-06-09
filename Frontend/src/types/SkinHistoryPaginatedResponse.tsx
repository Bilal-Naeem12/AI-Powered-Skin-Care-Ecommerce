import { SkinHistoryEntry } from "./SkinHistoryEntry";

export interface SkinHistoryPaginatedResponse {
  success: boolean;
  page: number;
  totalPages: number;
  totalEntries: number;
  entries: SkinHistoryEntry[];
}
