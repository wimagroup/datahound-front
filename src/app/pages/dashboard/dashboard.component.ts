import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdsHunterProduct } from 'src/app/model/ads-hunter-product.model';
import { AdsHunterService } from 'src/app/service/ads-hunter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products: AdsHunterProduct[] = [];
  filteredProducts: AdsHunterProduct[] = [];
  darkMode = false;
  comissaoMin?: number;
  comissaoMax?: number;
  comissaoMinReais?: number;
  comissaoMaxReais?: number;
  trafegoMin?: number;
  trafegoMax?: number;

  loading: boolean = false;

  constructor(private adsHunterService: AdsHunterService,  private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.adsHunterService.getProducts().subscribe({
      next: data => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erro ao buscar produtos', err);
        this.loading = false;
      }
    });
  }

  filter() {
    this.filteredProducts = this.products.filter(p => {
      const comissaoUsd = parseFloat(p.comissaoMediaUsdEur.replace(/[^\d.]/g, '')) || 0;
      const comissaoReais = parseFloat(p.comissaoMediaReais.replace(/[^\d.]/g, '')) || 0;
      const trafego = parseFloat(p.trafegoTotal?.replace(/[^\d.]/g, '')) || 0;

      return (!this.comissaoMin || comissaoUsd >= this.comissaoMin) &&
             (!this.comissaoMax || comissaoUsd <= this.comissaoMax) &&
             (!this.comissaoMinReais || comissaoReais >= this.comissaoMinReais) &&
             (!this.comissaoMaxReais || comissaoReais <= this.comissaoMaxReais) &&
             (!this.trafegoMin || trafego >= this.trafegoMin) &&
             (!this.trafegoMax || trafego <= this.trafegoMax);
    });
  }

  clearFilters() {
    this.comissaoMin = undefined;
    this.comissaoMax = undefined;
    this.comissaoMinReais = undefined;
    this.comissaoMaxReais = undefined;
    this.trafegoMin = undefined;
    this.trafegoMax = undefined;
    this.filteredProducts = [...this.products];
  }

  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    const body = document.body;
    if (this.darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }
  
}
