import { Component, NgZone, OnInit } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { WheatherService } from '../../services/wheather.service';
import { each } from '@amcharts/amcharts4/.internal/core/utils/Iterator';
import { $ } from 'protractor';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-wheather',
  templateUrl: './wheather.component.html',
  styleUrls: ['./wheather.component.css']
})
export class WheatherComponent implements OnInit {
  private chart: am4charts.XYChart;
  public dateNow = '';
  constructor(private zone: NgZone,private wheatherService:WheatherService) {

    var date = new Date();
    let d = date.getDate();

    if(d<10){
      d.toString();
      var day = `0${d.toString()}`;
    }
    
    this.dateNow = day+'-'+date.getMonth()+'-'+date.getFullYear();
    var theHtmlString = "";
    wheatherService.getWheather("27.4827916","-109.9520421").subscribe(wheather => {
        console.log('holo=>',wheather['data']);
        wheather['data'].forEach(element => {
          theHtmlString += `<tr><th scope="row">${element.valid_date}</th><td>${element.temp}</td></tr>`; 
        });
        var lista = document.getElementById("temperatures");
        lista.innerHTML = theHtmlString;
        console.log(theHtmlString)
    });
  }
  
  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      chart.paddingRight = 20;

      let data = [];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        data.push({ date: new Date(2019, 0, i), name: "name" + i, value: visits });
      }

      chart.data = data;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";

      series.tooltipText = "{valueY.value}";
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  ngOnInit() {
  }

  getWheatherByLatLot(data:String)
  {
    
    console.log('funcion',data.split(','));
    var cord = data.split(',');
    var lat = cord[0];
    var lot = cord[1];
    var theHtmlString = "";

    this.wheatherService.getWheather(lat,lot).subscribe(wheather => {
      console.log('holo=>',wheather['data']);
      wheather['data'].forEach(element => {
        theHtmlString += `<tr><th scope="row">${element.valid_date}</th><td>${element.temp}</td></tr>`; 
      });
      var lista = document.getElementById("temperatures");
      lista.innerHTML = theHtmlString;
      console.log(theHtmlString)
    });
  }

  getWheatherByUnits(units:string)
  {
    
   
    var cord = document.getElementById("cities");
    cord = cord[0].value.split(',');
   
    var lat = cord[0];
    var lot = cord[1];
    var theHtmlString = "";
    // return ;
    this.wheatherService.getWheather(lat, lot,units).subscribe(wheather => {
      console.log('holo=>',wheather['data']);
      wheather['data'].forEach(element => {
        theHtmlString += `<tr><th scope="row">${element.valid_date}</th><td>${element.temp}</td></tr>`; 
      });
      var lista = document.getElementById("temperatures");
      lista.innerHTML = theHtmlString;
      console.log(theHtmlString)
    });
  }

  // getWheatherByDate(date:string)
  // {

   
  //   var cord = document.getElementById("cities");
  //   cord = cord[0].value.split(',');

  //   var unit = document.getElementById("units")[0].value;
  //   var theHtmlString = "";

  //   var lat = cord[0];
  //   var lot = cord[1];
  //   this.wheatherService.getWheather(lat, lot, unit,date).subscribe(wheather => {
  //     console.log('holo=>',wheather['data']);
  //     wheather['data'].forEach(element => {
  //       theHtmlString += `<tr><th scope="row">${element.valid_date}</th><td>${element.temp}</td></tr>`; 
  //     });
  //     var lista = document.getElementById("temperatures");
  //     lista.innerHTML = theHtmlString;
  //     console.log(theHtmlString)
  //   });
  // }
}
