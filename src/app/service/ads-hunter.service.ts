import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdsHunterProduct } from '../model/ads-hunter-product.model';


@Injectable({ providedIn: 'root' })
export class AdsHunterService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<AdsHunterProduct[]> {
    return this.http.get<AdsHunterProduct[]>('/api/adshunter/products');
  }
}
