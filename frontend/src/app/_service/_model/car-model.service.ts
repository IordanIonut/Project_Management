import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, retry } from 'rxjs';
import { CarModel } from '../../_model/_interface/car-model';
import { CarModelFilterDTO } from '../../_model/_dto/car-model-filter-dto';
import {
  FindByRequestDTO,
  TableRequest,
} from '../../_model/_dto/find-by-request-dto';
import { ChangePage } from '../../_model/_common/change-page';
import { SortPage } from '../../_model/_common/sort-page';
import { GroupResult } from '../../_model/_common/group-result';

@Injectable({
  providedIn: 'root',
})
export class CarsModelService {
  private authUrl = Environment.apiUrl + '/car/model';

  constructor(private _http: HttpClient) {}

  findAllCarModel(): Observable<CarModel[]> {
    return this._http.get<CarModel[]>(`${this.authUrl}/find/all`);
  }

  findByName(name: string): Observable<CarModel[]> {
    return this._http.get<CarModel[]>(
      `${this.authUrl}/find-search/by?name=${name}`
    );
  }

  postCarModelByCarModelFilter(
    changePage: ChangePage,
    sortPage: SortPage,
    carModelFilterDTO: CarModelFilterDTO
  ): Observable<GroupResult<CarModel>> {
    return this._http.post<GroupResult<CarModel>>(`${this.authUrl}/find-by`, {
      tableRequest: { changePage, sortPage } as TableRequest,
      carModelFilterDTO: carModelFilterDTO,
    } as FindByRequestDTO);
  }

  excelCarModelByCarModelFilter(
    column: string,
    carModelFilterDTO: CarModelFilterDTO
  ): Observable<any> {
    return this._http.post<any>(`${this.authUrl}/excel-by?column=${column}`, {
      carModelFilterDTO: carModelFilterDTO,
    } as FindByRequestDTO);
  }

  save(carModel: CarModel): Observable<any> {
    return this._http.post<any>(`${this.authUrl}/save`, carModel);
  }

  delete(id: string): Observable<any> {
    return this._http.delete<any>(`${this.authUrl}/delete-by?id=${id}`);
  }
}
