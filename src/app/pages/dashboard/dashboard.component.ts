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

  constructor(private adsHunterService: AdsHunterService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const filters = {
      comissaoMinUsdEur: null,
      comissaoMaxUsdEur: null,
      comissaoMinReais: null,
      comissaoMaxReais: null,
      trafegoMin: null,
      trafegoMax: null
    };
    this.adsHunterService.filterProducts(filters).subscribe({
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
    const filters = {
      comissaoMinUsdEur: this.comissaoMin || null,
      comissaoMaxUsdEur: this.comissaoMax || null,
      comissaoMinReais: this.comissaoMinReais || null,
      comissaoMaxReais: this.comissaoMaxReais || null,
      trafegoMin: this.trafegoMin || null,
      trafegoMax: this.trafegoMax || null
    };

    this.loading = true;

    this.adsHunterService.filterProducts(filters).subscribe({
      next: data => {
        this.filteredProducts = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erro ao filtrar produtos', err);
        this.loading = false;
      }
    });
  }

  clearFilters() {
    this.comissaoMin = undefined;
    this.comissaoMax = undefined;
    this.comissaoMinReais = undefined;
    this.comissaoMaxReais = undefined;
    this.trafegoMin = undefined;
    this.trafegoMax = undefined;
    this.loadData();
  }

  onLogout(): void {
    localStorage.removeItem('authToken');
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

  parsePercentage(value: string): number {
    if (!value) {
      return 0;
    }
    const cleaned = value.replace('%', '').replace(',', '.').trim();
    return parseFloat(cleaned);
  }

  getComparisonClass(value: string): string {
    const num = this.parsePercentage(value);
    if (num > 0) {
      return 'text-green';
    }
    if (num < 0) {
      return 'text-red';
    }
    return '';
  }
}
