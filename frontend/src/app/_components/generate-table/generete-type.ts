import { Cars } from '../../_model/_interface/car';
import { CarsParts } from '../../_model/_interface/cars-parts';
import { Machines } from '../../_model/_interface/machine';
import { PartProduction } from '../../_model/_interface/part-production';
import { ProcessLog } from '../../_model/_interface/process-log';
import { QualityChecks } from '../../_model/_interface/quality-checks';
import { User } from '../../_model/_interface/user';

export type GenerateType =
  | ProcessLog
  | Cars
  | QualityChecks
  | CarsParts
  | PartProduction
  | Machines
  | User;
