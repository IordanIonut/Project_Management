import { ChangePage } from '../_common/change-page';
import { SortPage } from '../_common/sort-page';
import { CarsFiltersDTO } from './cars-filter-dto';
import { CarsPartsFilterDTO } from './cars-parts-filter-dto';
import { MachineAllFiltersDTO } from './machine-all-filter.dto';
import { MachineFiltersDTO } from './machine-filters-dto';
import { MachineUsedFiltersDTO } from './machine-used-filters-dto';
import { PartProductionFiltersDTO } from './part_production-filter-dto';
import { ProcessLogsFilterDTO } from './process-log-filter-dto';
import { QualityChecksFiltersDTO } from './quality-check-filter-dto';
import { UserAllFiltersDTO } from './user-all-filters-dto';

export interface FindByRequestDTO {
  tableRequest?: TableRequest;
  processLogsFilterDTO?: ProcessLogsFilterDTO;
  carsFiltersDTO?: CarsFiltersDTO;
  qualityChecksFiltersDTO?: QualityChecksFiltersDTO;
  carsPartsFiltersDTO?: CarsPartsFilterDTO;
  machineUsedFiltersDTO?: MachineUsedFiltersDTO;
  partProductionFiltersDTO?: PartProductionFiltersDTO;
  machineFiltersDTO?: MachineFiltersDTO;
  userAllFiltersDTO?: UserAllFiltersDTO;
  machineAllFiltersDTO?: MachineAllFiltersDTO;
}

export interface TableRequest {
  changePage: ChangePage;
  sortPage: SortPage;
}
