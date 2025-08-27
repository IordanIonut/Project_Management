import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountViewDTO } from '../../_model/_dto/count-view-dto';
import { Machines } from '../../_model/_interface/machine';
import { MachineStatus } from '../../_model/_enum/machine-status';
import { GroupResult } from '../../_model/_common/group-result';
import { ChangePage } from '../../_model/_common/change-page';
import { SortPage } from '../../_model/_common/sort-page';
import {
  FindByRequestDTO,
  TableRequest,
} from '../../_model/_dto/find-by-request-dto';
import { MachineAllFiltersDTO } from '../../_model/_dto/machine-all-filter.dto';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  private authUrl = Environment.apiUrl + '/machines';

  constructor(private _http: HttpClient) {}

  countStatusByMachineId(machineId: string): Observable<CountViewDTO> {
    return this._http.get<CountViewDTO>(
      `${this.authUrl}/count/dialog/by?machineId=${machineId}`
    );
  }

  findMachinesByNameOrId(machine_name_or_id: string): Observable<Machines> {
    return this._http.get<Machines>(
      `${this.authUrl}/find/by?machine_name_or_id=${machine_name_or_id}`
    );
  }

  canAccessPage(
    machine_name_or_id: string,
    username: string
  ): Observable<Boolean> {
    const params = new HttpParams()
      .append('machine_name_or_id', machine_name_or_id)
      .append('username', username);
    return this._http.get<Boolean>(`${this.authUrl}/can-access?${params}`);
  }

  updateMachineStatus(
    machine_name_or_id: string,
    status: MachineStatus
  ): Observable<number> {
    return this._http.put<number>(
      `${this.authUrl}/put/status?machine_name_or_id=${machine_name_or_id}&status=${status}`,
      null
    );
  }

  findMachinesByName(machine_name: string): Observable<Machines[]> {
    return this._http.get<Machines[]>(
      `${this.authUrl}/find-search/by?machine_name=${machine_name}`
    );
  }

  save(machine: Machines): Observable<Machines> {
    return this._http.post<Machines>(`${this.authUrl}/save`, machine);
  }

  findByMachineAllFilters(
    changePage: ChangePage,
    sortPage: SortPage,
    machineAllFiltersDTO: MachineAllFiltersDTO
  ): Observable<GroupResult<Machines>> {
    const tableRequest: TableRequest = { changePage, sortPage };

    return this._http.post<GroupResult<Machines>>(
      `${this.authUrl}/find-all/by`,
      {
        tableRequest: tableRequest,
        machineAllFiltersDTO: machineAllFiltersDTO,
      } as FindByRequestDTO
    );
  }

  excelAllByMachineAllFilters(
    columns: string,
    machineAllFiltersDTO: MachineAllFiltersDTO
  ): Observable<any[]> {
    return this._http.post<any[]>(
      `${this.authUrl}/excel-all/by?columns=${columns}`,
      { machineAllFiltersDTO: machineAllFiltersDTO } as FindByRequestDTO
    );
  }

  deleteById(id: string): Observable<any> {
    return this._http.delete<any>(`${this.authUrl}/delete-by?id=${id}`);
  }
}
