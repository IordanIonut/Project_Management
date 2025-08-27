import { CarsStatus } from '../../_model/_enum/cars-status';
import { MachineStatus } from '../../_model/_enum/machine-status';
import { ProcessLogStatus } from '../../_model/_enum/process-log-status';

export type CHANGE_STATUS = MachineStatus | ProcessLogStatus | CarsStatus;
