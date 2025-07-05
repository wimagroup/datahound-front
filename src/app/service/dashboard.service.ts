import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  aceitarTermos(): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', this.getAuthToken());
    return this.http.post<void>(`${environment.apiUrl}/users/accept-terms`, {}, { headers });
  }
  
  alterarSenha(newPassword: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', this.getAuthToken());
    return this.http.post<void>(`${environment.apiUrl}/users/change-password`, { newPassword }, { headers });
  }
}
