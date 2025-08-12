import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHelper } from '../helpers/auth.helper';
import { BaseService } from './base.service';
import { RegisterRequest } from '../models/register-request.model';
import { SwitchWorkspaceRequest } from '../models/switch-workspace-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  signup(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/authenticate`, data);
  }

  switchWorkspace(data: SwitchWorkspaceRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/switch-workspace`, data);
  }

  logout(): Observable<any> {
    const token = AuthHelper.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers });
  }
}
