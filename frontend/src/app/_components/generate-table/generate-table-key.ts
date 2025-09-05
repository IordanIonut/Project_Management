export enum GenerateTableKeys {
  PROCESS_LOG = 'Process Logs',
  CARS = 'Cars',
  QUALITY_CHECKS = 'Quality Checks',
  ASSIGNED_PARTS = 'Assigned Parts',
  MACHINE_USED = 'Machine Used',

  //PAGE
  ////Machine
  MACHINE_PAGE = 'Users Used',
  PART_PRODUCTION_BY_MACHINE = 'Part Production by Machine',

  ////ProcessLog
  PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME = 'Process Log by Process',

  //ALL
  USER_ALL = 'All Users',
  MACHINE_ALL = 'All Machines',
  CAR_ALL = 'All Cars',
  CARS_MODEL_ALL = 'All Cars Model',
}

export const Dashboard_And_User_Page = [
  GenerateTableKeys.PROCESS_LOG,
  GenerateTableKeys.CARS,
  GenerateTableKeys.QUALITY_CHECKS,
  GenerateTableKeys.ASSIGNED_PARTS,
  GenerateTableKeys.MACHINE_USED,
];
