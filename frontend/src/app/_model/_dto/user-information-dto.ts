export interface UserInformationDTO {
  countProcessLog: number;
  countCars: number;
  countQualityChecks: number;
  countAssignedParts: number;
  countMachineUsed: number;
  countByPartProduction: number;
  //Page
  countByMachine: number;

  //All
  countAllUsers: number;
  countAllMachine: number;
  countAllCars: number;
  countAllCarModels: number;
}
