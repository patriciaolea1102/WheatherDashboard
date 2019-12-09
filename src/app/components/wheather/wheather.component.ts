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
   
  }
  
  ngAfterViewInit() {
    var theHtmlString = "";
    this.wheatherService.getWheather("27.4827916","-109.9520421",null,15).subscribe(wheather => {
      this.initGraf(wheather['data']);
        wheather['data'].forEach(element => {
          theHtmlString += `<tr><th scope="row">${element.valid_date}</th><td>${element.temp}</td></tr>`; 
        });
        var lista = document.getElementById("temperatures");
        lista.innerHTML = theHtmlString;

    });
    
  }

  initGraf(dataGraf){

    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      chart.paddingRight = 20;

      let data = [];
      let visits = 10;
      dataGraf.forEach(row => {
        data.push({ date: row.datetime, name: "name" + row.datetime, value: row.temp });
      });

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
    var e = (document.getElementById("units")) as HTMLSelectElement;
    var sel = e.selectedIndex;
    var opt = e.options[sel];
    var unit = opt.value;
    
    var cord = data.split(',');
    var lat = cord[0];
    var lot = cord[1];
    var theHtmlString = "";

    this.wheatherService.getWheather(lat,lot,unit,15).subscribe(wheather => {
      this.initGraf(wheather['data']);

      wheather['data'].forEach(element => {
        theHtmlString += `<tr><th scope="row">${element.valid_date}</th><td>${element.temp}</td></tr>`; 
      });
      var lista = document.getElementById("temperatures");
      lista.innerHTML = theHtmlString;
    });
  }

  getWheatherByUnits(units:string)
  {
    var e = (document.getElementById("cities")) as HTMLSelectElement;
    var sel = e.selectedIndex;
    var opt = e.options[sel];

    var cord =  opt.value.split(',');
    var lat = cord[0];
    var lot = cord[1];
    var theHtmlString = "";

    this.wheatherService.getWheather(lat, lot,units).subscribe(wheather => {
      this.initGraf(wheather['data']);

      wheather['data'].forEach(element => {
        theHtmlString += `<tr><th scope="row">${element.valid_date}</th><td>${element.temp}</td></tr>`; 
      });
      var lista = document.getElementById("temperatures");
      lista.innerHTML = theHtmlString;
    });
  }
}
