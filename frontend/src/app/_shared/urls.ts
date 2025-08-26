import { CANCELLED } from 'dns';

export const Urls = {
  ///MACHINE
  MACHINE_NAME: { url: 'dashboard/machine', code: 'machine_id.name' },
  MACHINE_ID: { url: 'dashboard/machine', code: 'machine_id.id' },
  MACHINE_DISPLAY_NAME: { url: 'dashboard/machine', code: 'name' },

  ///PROCESS
  PROCESS_ID: { url: 'dashboard/process', code: 'id' },

  //CARS
  CARS_VIN: { url: 'dashboard/car', code: 'vin' },
  CARS_ID: { url: 'dashboard/car', code: 'id' },
  CARS_NAME: { url: 'dashboard/car', code: 'model_id.name' },
  CARS_ID_NAME: { url: 'dashboard/car', code: 'car_id.model_id.name' },

  //USER
  USER_EMPLOYEE_ID: { url: 'dashboard/user', code: 'employee_id.user_id.id' },
  USER_EMPLOYEE_NAME: {
    url: 'dashboard/user',
    code: 'employee_id.user_id.username',
  },
  USER_EMPLOYEE_EMAIL: {
    url: 'dashboard/user',
    code: 'employee_id.user_id.email',
  },
  USER_NAME: { url: 'dashboard/user', code: 'username' },
};
