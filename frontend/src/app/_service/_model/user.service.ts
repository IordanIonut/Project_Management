import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../_model/_interface/user';
import { Observable } from 'rxjs';
import { UserInformationDTO } from '../../_model/_dto/user-information-dto';
import { ChangePage } from '../../_model/_common/change-page';
import { SortPage } from '../../_model/_common/sort-page';
import { FindByRequestDTO } from '../../_model/_dto/find-by-request-dto';
import { GroupResult } from '../../_model/_common/group-result';
import { UserAllFiltersDTO } from '../../_model/_dto/user-all-filters-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authUrl = Environment.apiUrl + '/user';

  constructor(private _http: HttpClient) {}

  countInformation(
    name: string,
    machine_name_or_id: string
  ): Observable<UserInformationDTO> {
    const params = new HttpParams()
      .append('name', name)
      .append('machine_name_or_id', machine_name_or_id);
    return this._http.get<UserInformationDTO>(
      `${this.authUrl}/information?${params}`
    );
  }

  findUserByUsernameOrId(
    user_username_or_id_or_email: string
  ): Observable<User> {
    const params = new HttpParams().append(
      'user_username_or_id_or_email',
      user_username_or_id_or_email
    );
    return this._http.get<User>(`${this.authUrl}/find/by?${params}`);
  }

  canAccessPage(user_username_or_id_or_email: string): Observable<Boolean> {
    const params = new HttpParams().append(
      'user_username_or_id_or_email',
      user_username_or_id_or_email
    );
    return this._http.get<Boolean>(`${this.authUrl}/can-access?${params}`);
  }

  findUsersByUsername(user_username: string): Observable<User[]> {
    return this._http.get<User[]>(
      `${this.authUrl}/find-search/by?user_username=${user_username}`
    );
  }

  findByEmail(email: string): Observable<User> {
    const params = new HttpParams().append('email', email);
    return this._http.get<User>(`${this.authUrl}/find-email/by?${params}`);
  }

  save(user: User): Observable<User> {
    return this._http.post<User>(`${this.authUrl}/save`, user);
  }

  findAllByUserAllFilters(
    changePage: ChangePage,
    sortPage: SortPage,
    userAllFiltersDTO: UserAllFiltersDTO
  ): Observable<GroupResult<User>> {
    const tableRequest = { changePage, sortPage };

    return this._http.post<GroupResult<User>>(`${this.authUrl}/find-all/by`, {
      tableRequest: tableRequest,
      userAllFiltersDTO: userAllFiltersDTO,
    } as FindByRequestDTO);
  }

  excelAllByUserAllFilters(
    columns: string,
    userAllFiltersDTO: UserAllFiltersDTO
  ): Observable<any[]> {
    return this._http.post<any[]>(
      `${this.authUrl}/excel-all/by?columns=${columns}`,
      { userAllFiltersDTO: userAllFiltersDTO } as FindByRequestDTO
    );
  }

  deleteById(id: string): Observable<any> {
    return this._http.delete<any>(`${this.authUrl}/delete-by?id=${id}`);
  }
}
