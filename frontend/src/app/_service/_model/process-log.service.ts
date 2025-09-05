import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcessLog } from '../../_model/_interface/process-log';
import { GroupResult } from '../../_model/_common/group-result';
import { ChangePage } from '../../_model/_common/change-page';
import { SortPage } from '../../_model/_common/sort-page';
import { ProcessLogsFilterDTO } from '../../_model/_dto/process-log-filter-dto';
import {
  FindByRequestDTO,
  TableRequest,
} from '../../_model/_dto/find-by-request-dto';
import { MachineUsedFiltersDTO } from '../../_model/_dto/machine-used-filters-dto';
import { MachineFiltersDTO } from '../../_model/_dto/machine-filters-dto';
import { ProcessLogStatus } from '../../_model/_enum/process-log-status';

@Injectable({
  providedIn: 'root',
})
export class ProcessLogService {
  private authUrl = Environment.apiUrl + '/process/log';

  constructor(private _http: HttpClient) {}

  getDataByUserNameAndProcessLogIdAndProcessLogFilters(
    username: string,
    process_log_id: string,
    changePage: ChangePage,
    sortPage: SortPage,
    processLogsFilter: ProcessLogsFilterDTO
  ): Observable<GroupResult<ProcessLog>> {
    const tableRequest = { changePage: changePage, sortPage: sortPage };
    const requestBody = {
      tableRequest: tableRequest,
      processLogsFilterDTO: processLogsFilter,
    };
    const params = new URLSearchParams();
    params.append('username', username);
    if (process_log_id !== null) {
      params.append('process_log_id', process_log_id);
    }
    return this._http.post<GroupResult<ProcessLog>>(
      `${this.authUrl}/find/by-process-log?${params.toString()}`,
      requestBody
    );
  }

  postExcelByUserNameAndProcessLogIdAndProcessLogFilters(
    username: string,
    process_log_id: string,
    columns: string,
    processLogsFilter: ProcessLogsFilterDTO
  ): Observable<any[]> {
    const params = new URLSearchParams();
    if (process_log_id !== null) {
      params.append('process_log_id', process_log_id);
    }
    params.append('username', username);
    params.append('columns', columns);
    const requestBody = {
      processLogsFilterDTO: processLogsFilter,
    };
    return this._http.post<any[]>(
      `${this.authUrl}/excel/find/by-process-log?${params.toString()}`,
      requestBody
    );
  }

  postDataByUsernameAndMachineUsedFilters(
    userName: string,
    changePage: ChangePage,
    sortPage: SortPage,
    machineUsedFiltersDTO: MachineUsedFiltersDTO
  ): Observable<GroupResult<ProcessLog>> {
    const tableRequest: TableRequest = {
      changePage: changePage,
      sortPage: sortPage,
    };
    const requestBody: FindByRequestDTO = {
      tableRequest: tableRequest,
      machineUsedFiltersDTO: machineUsedFiltersDTO,
    };
    const params = new URLSearchParams();
    params.append('username', userName);

    return this._http.post<GroupResult<ProcessLog>>(
      `${this.authUrl}/find/by-machine-used?${params.toString()}`,
      requestBody
    );
  }

  postExcelByUserNameAndMachineUsedFilters(
    name: string,
    columns: string,
    machineUsedFiltersDTO: MachineUsedFiltersDTO
  ): Observable<any[]> {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('columns', columns);
    const requestBody: FindByRequestDTO = {
      machineUsedFiltersDTO: machineUsedFiltersDTO,
    };
    return this._http.post<any[]>(
      `${this.authUrl}/excel/find/by-machine-used?${params.toString()}`,
      requestBody
    );
  }

  postDataByMachineNameOrIdAndMachineFilters(
    machine_name_or_id: string,
    changePage: ChangePage,
    sortPage: SortPage,
    machineFiltersDTO: MachineFiltersDTO
  ): Observable<GroupResult<ProcessLog>> {
    const body: FindByRequestDTO = {
      tableRequest: {
        changePage: changePage,
        sortPage: sortPage,
      } as TableRequest,
      machineFiltersDTO: machineFiltersDTO,
    };
    return this._http.post<GroupResult<ProcessLog>>(
      `${this.authUrl}/find/by-machine?machine_name_or_id=${machine_name_or_id}`,
      body
    );
  }

  postExcelByMachineNameOrIdAndMachineFilters(
    machine_name_or_id: string,
    columns: string,
    machineFiltersDTO: MachineFiltersDTO
  ): Observable<any[]> {
    return this._http.post<any[]>(
      `${this.authUrl}/excel/find/by-machine?machine_name_or_id=${machine_name_or_id}&columns=${columns}`,
      { machineFiltersDTO: machineFiltersDTO } as FindByRequestDTO
    );
  }

  findProcessByNameOrId(process_name_or_id: string): Observable<ProcessLog> {
    return this._http.get<ProcessLog>(
      `${this.authUrl}/find/by?process_name_or_id=${process_name_or_id}`
    );
  }

  updateProcessLogStatus(
    process_name_or_id: string,
    status: ProcessLogStatus
  ): Observable<number> {
    return this._http.put<number>(
      `${this.authUrl}/put/status?process_name_or_id=${process_name_or_id}&status=${status}`,
      null
    );
  }

  canAccessPage(
    process_name_or_id: string,
    username: string
  ): Observable<boolean> {
    return this._http.get<boolean>(
      `${this.authUrl}/can-access?process_name_or_id=${process_name_or_id}&username=${username}`
    );
  }
}
