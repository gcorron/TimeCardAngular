import { SelectListItem } from "./selectListItem";
import { Work } from "./work";

export class WorkViewModel {
  payCycles: SelectListItem[];
  jobs: SelectListItem[];
  workTypes: SelectListItem[];
  editDays: SelectListItem[];
  workEntries: Work[];
  dailyTotals: number[];
  editWork: Work;
  isCycleOpen: boolean;
  canCloseCycle: boolean;
  selectedCycle: number;
  action: string;
}
