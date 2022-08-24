import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }
  // Chooses between EUR and USD. If i want EUR i should be able to get EUR and same for USD
  getCurrency(currency: string){
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&sparkline=false`);
  }

  // Looks at the trending currency and displays them at the loop at the top
  getTrendingCurrency(currency: string){
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`)
  }

  getGraphicalCurrencyData(coinId: string, currency: string, days: number){
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`)
  }

  // Getting details of a specific currency
  getCurrencyById(coinId: string){
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/${coinId}`)
  }

}

