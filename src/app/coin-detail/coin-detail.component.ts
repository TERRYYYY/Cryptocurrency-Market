import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import {ChartConfiguration, ChartType} from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from '../service/currency.service';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {
  panelOpenState = false;

  coinData: any;
  coinId!: string;
  days: number= 30;
  currency : string = "EUR";

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#b700ff',
        pointBackgroundColor: '#b700ff',
        pointBorderColor: '#b700ff',
        pointHoverBackgroundColor: '#b700ff',
        pointHoverBorderColor: '#b700ff',

      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1
      }
    },

    plugins: {
      legend: { display: true },
    }
  };

  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart !: BaseChartDirective;

  constructor(private api : ApiService, private activatedRoute : ActivatedRoute, private currencyService: CurrencyService, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val =>{
      this.coinId = val["id"];
    })
    this.getCoinData();
    this.getGraphData(this.days);
    this.getAllCoinData();

    this.currencyService.getCurrency().subscribe(val =>{
      this.currency = val;
      this.getCoinData();
      this.getGraphData(this.days);
    })
  }
  getAllCoinData(){
    this.api.getCurrency(this.currency)
      .subscribe(res => {
        console.log(res);
      
      })
  }

  getCoinData(){
    this.api.getCurrencyById(this.coinId).subscribe(res =>{
      this.coinData = res;
      console.log(this.coinData);

      if(this.currency === "USD"){
        res.market_data.current_price.eur = res.market_data.current_price.usd;
        res.market_data.market_cap.eur = res.market_data.market_cap.usd;
      }
      res.market_data.current_price.eur = res.market_data.current_price.eur;
      res.market_data.market_cap.eur = res.market_data.market_cap.eur;
      this.coinData = res;
    })
  }

  getGraphData(days: number){
    this.days = days;
    this.api.getGraphicalCurrencyData(this.coinId,this.currency,this.days).subscribe(res=>{
      setTimeout(()=>{
        this.myLineChart.chart?.update();
      },100)
      this.lineChartData.datasets[0].data = res.prices.map((a:any)=>{
        return a[1];
      });
      this.lineChartData.labels = res.prices.map((a:any)=>{
        let date = new Date(a[0]);
        let time = date.getHours() > 12 ? 
          `${date.getHours() - 12}: ${date.getMinutes()} PM`:
          `${date.getHours()}: ${date.getMinutes()} AM`
        return this.days === 1 ? time : date.toLocaleTimeString();
      })
  })

  }

  gotoDetails(row: any){
    this.router.navigate(['coin-detail', row.id])
  }
  homePage(){
    this.router.navigate(['coin-list'])
  }
}
