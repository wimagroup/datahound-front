import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdsHunterProduct } from '../model/ads-hunter-product.model';
import { environment } from 'src/environments/environment';
import { Page } from '../model/page.model';

@Injectable({ providedIn: 'root' })
export class AdsHunterService {
  constructor(private http: HttpClient) { }

  filterProducts(filters: any, page: number, size: number): Observable<Page<AdsHunterProduct>> {
    const headers = new HttpHeaders().set('Authorization', this.getAuthToken());
    return this.http.post<Page<AdsHunterProduct>>(
      `${environment.apiUrl}/products/filter?page=${page}&size=${size}`,
      filters,
      { headers }
    );
  }

  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  toggleFavorito(produtoId: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', this.getAuthToken());
    return this.http.post<void>(
      `${environment.apiUrl}/products/${produtoId}/toggle-favorito`,
      {},
      { headers }
    );
  }
  
}
