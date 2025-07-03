import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdsHunterProduct } from '../model/ads-hunter-product.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AdsHunterService {
  constructor(private http: HttpClient) {}

  filterProducts(filters: any): Observable<AdsHunterProduct[]> {
    const headers = new HttpHeaders().set('Authorization', this.getAuthToken());
    return this.http.post<AdsHunterProduct[]>(`${environment.apiUrl}/products/filter`, filters, { headers });
  }

  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}
