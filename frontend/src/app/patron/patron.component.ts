import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserEditComponent } from '../user-edit/user-edit.component';
interface User {
  id: number;
  name: string;
  type: string;
  level?: number;
  experience?: number;
  progress?: number;
}
@Component({
  selector: 'app-patron',
  templateUrl: './patron.component.html',
  styleUrls: ['./patron.component.css']
})
export class PatronComponent implements OnInit {
  // properties
  selectedMonth: string;
  selectedYear: number;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = [2023, 2022];
  totalSpendings: number;
  totalXP: number;
  monthlySpendings: any[];
  yearlySpendings: any[];
  currentYearData: any[] = [];
  currentMonthData: any[] = [];
  user: User = {
    id: 1,
    name: 'John',
    type: 'admin',
    level: 1,
    experience: 20,
    progress: 96
  };
  // chart options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Year';
  showYAxisLabel = true;
  yAxisLabel = 'Total Sales';
  colorScheme: any = {
    name: 'myColorScheme',
    selectable: true,
    group: 'Ordinal',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {
    // initialize properties

    this.selectedMonth = this.months[new Date().getMonth()];
    this.selectedYear = 2023;
    this.totalSpendings = 0;
    this.totalXP = 0;
    this.monthlySpendings = [
      {
        name: 'January',
        value: [
          100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200,
          1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400,
          100, 200, 300, 400, 500, 600, 700
        ]
      },
      {
        name: 'February',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      },
      {
        name: 'March',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      },
      {
        name: 'April',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      },
      {
        name: 'May',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      },
      {
        name: 'June',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      },
      {
        name: 'July',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      },
      {
        name: 'August',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      },
      {
        name: 'September',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      },
      {
        name: 'October',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      },
      {
        name: 'November',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      }, {
        name: 'December',
        value: [
          200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
          1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 100
        ]
      }
    ];
    this.yearlySpendings = [
      {
        name: '2022',
        value: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
      },
      {
        name: '2023',
        value: [1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
      }
    ];

  }
  ngOnInit() {
    // Get data for current year
    this.currentYearData = this.yearlySpendings.find(y => y.name === this.selectedYear.toString())?.value;
  
    // Get data for current month
    const monthIndex = this.months.indexOf(this.selectedMonth) + 1; // add 1 to get month number
    this.currentMonthData = this.monthlySpendings.find(m => parseInt(m.name) === monthIndex)?.value;
  
    // Get data for selected year
    this.selectedYear = this.yearlySpendings.find(y => y.name === this.selectedYear.toString())?.data;
  
    // Get data for selected month
    this.selectedMonth = this.monthlySpendings.find(m => parseInt(m.name) === monthIndex)?.data;
  }
  


  filterData() {
    // code to filter data based on selectedMonth and selectedYear
    // and update totalSpendings, totalXP, monthlySpendings and yearlySpendings properties
  }
}