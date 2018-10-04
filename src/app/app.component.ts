import { Component } from '@angular/core';
import { DemoService } from './demo.service';
import { Observable } from 'rxjs/Rx';
import { reject } from 'q';


@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',

  styleUrls: ['./app.component.css']

})
export class AppComponent {

  public contracts: any;
  public cases: any;
  public territories: any;
  public caseStatusTerritories: any;
  public dataTableArray: any;
  public columnChartData: any;
  public barChartData2: any;
  public selectedTerritories: any = 'all';
  public selectedTerritoriesCasetype: any = 'all';
  public dropdownListTerritory = [];
  public dropdownListCaseStatusTerritory = [];
  public dropdownListStatus = [];
  public dropdownListCaseType = [];
  public selectedItems = [];
  public dropdownSettings = {};
  public dropdownListContractType = [];
  constructor(private _demoService: DemoService) { }


  public getData() {
    return new Promise((resolve, reject) => {


      this._demoService.getContracts(this.selectedTerritories).subscribe(data => {
        this.contracts = data;
        console.log("contracts" + this.contracts)
      }, err => console.error(err),
        // the third argument is a function which runs on completion
        () => {
          let array = [];
          array.push(['Status', 'No. of Median Days', { role: "annotation" }, { role: "style" }]);
          // ARRAY OF OBJECTS
          for (let i in this.contracts) {
            console.log(i);
            // Create new array above and push every object in
            array.push([this.contracts[i].status, parseInt(this.contracts[i].mediandays), parseInt(this.contracts[i].contractscount), 'c40bb9']);
          }
          console.log(array);
          resolve(array);
        }
      )
    }).catch((error) => {
      reject(error);
      console.log('errorin getting data :', error);
    })
  }

  public getCaseData() {
    return new Promise((resolve, reject) => {


      this._demoService.getCases(this.selectedTerritoriesCasetype).subscribe(data => {
        this.cases = data;
        console.log("contracts" + this.cases)
      }, err => console.error(err),
        // the third argument is a function which runs on completion
        () => {
          let array = [];
          array.push(['Status', 'No. of Median Days', { role: "annotation" }, { role: "style" }]);
          // ARRAY OF OBJECTS
          for (let i in this.cases) {
            console.log(i);
            // Create new array above and push every object in
            array.push([this.cases[i].status, parseInt(this.cases[i].mediandays), parseInt(this.cases[i].contractscount), 'f13561']);
          }
          console.log(array);
          resolve(array);
        }
      )
    }).catch((error) => {
      reject(error);
      console.log('errorin getting data :', error);
    })
  }

  public getTerritoriesData() {
    return new Promise((resolve, reject) => {
      this._demoService.getTerritories().subscribe(data => {
        this.territories = data;
        console.log("territories" + this.territories)
      }, err => console.error(err),
        // the third argument is a function which runs on completion
        () => {
          let array = [];
          let count = 0;
          for (let i in this.territories) {
            array.push({ 'item_id': this.territories[i].territory, 'item_text': this.territories[i].territory });
            count++;
          }
          console.log(array);
          resolve(array);
        }
      )
    }).catch((error) => {
      reject(error);
      console.log('errorin getting data :', error);
    })
  }


  public getCaseStatusTerritoriesData() {
    return new Promise((resolve, reject) => {
      this._demoService.getCaseStatusTerritories().subscribe(data => {
        this.caseStatusTerritories = data;
        console.log("territories" + this.caseStatusTerritories)
      }, err => console.error(err),
        // the third argument is a function which runs on completion
        () => {
          let array = [];
          let count = 0;
          for (let i in this.caseStatusTerritories) {
            array.push({ 'item_id': this.caseStatusTerritories[i].territory, 'item_text': this.caseStatusTerritories[i].territory });
            count++;
          }
          console.log(array);
          resolve(array);
        }
      )
    }).catch((error) => {
      reject(error);
      console.log('errorin getting data :', error);
    })
  }


  public drawchart1(res) {
    this.columnChartData = {
      chartType: 'BarChart',
      dataTable: res,
      options: {
        title: 'Contract State', width: 900, height: 600, legend: { position: 'bottom', color: '#f13561' },
        series: {
          0: { color: '#c40bb9' }
        }
      }
    }
  }


  public drawchart2(res) {
    this.barChartData2 = {
      chartType: 'BarChart',
      dataTable: res,
      options: {
        title: 'Case Status', width: 900, height: 500, legend: { position: 'bottom', color: '#f13561' },
        series: {
          0: { color: '#f13561' }
        }
      }
    }
  }
  ngOnInit() {
    this.getData().then((res: any) => {
      console.log(res)
      this.columnChartData = {
        chartType: 'BarChart',
        dataTable: res,
        options: {
          title: 'Contract State', width: 900, height: 600, legend: { position: 'bottom' },
          series: {
            0: { color: '#c40bb9' }
          }
        }
      };
    });

    this.getTerritoriesData().then((res: any) => {
      console.log("territories" + res)
      this.dropdownListTerritory = res;

    });

    this.getCaseStatusTerritoriesData().then((res: any) => {
      console.log("territories" + res)
      this.dropdownListCaseStatusTerritory = res;

    });

    this.getCaseData().then((res: any) => {
      console.log(res)
      this.barChartData2 = {
        chartType: 'BarChart',
        dataTable: res,
        options: {
          title: 'Case State', width: 900, height: 500, legend: { position: 'bottom', color: '#f13561' },
          series: {
            0: { color: '#f13561' }
          }
        }
      };
    });
    // this.dropdownListTerritory = [
    //   { item_id: 1, item_text: 'T1' },
    //   { item_id: 2, item_text: 'T2' },
    //   { item_id: 3, item_text: 'T3' },
    //   { item_id: 5, item_text: 'Other' }
    // ];
    this.dropdownListStatus = [
      { item_id: 1, item_text: 'Open' },
      { item_id: 2, item_text: 'Closed' },
      { item_id: 3, item_text: 'Pending' },
      { item_id: 5, item_text: 'InProgress' }
    ];
    this.dropdownListCaseType = [
      { item_id: 1, item_text: 'Case Type 1' },
      { item_id: 2, item_text: 'Maintenance' },
      { item_id: 3, item_text: 'Case Type 3' },
      { item_id: 5, item_text: 'Case Type 4' },
      { item_id: 2, item_text: 'Case Type 5' },
      { item_id: 3, item_text: 'Case Type 6' },
    ];

    this.dropdownListContractType = [
      { item_id: 1, item_text: 'Contract Type 1' },
      { item_id: 2, item_text: 'Maintenance' },
      { item_id: 3, item_text: 'Contract Type 3' },
      { item_id: 4, item_text: 'Contract Type 4' },
      { item_id: 5, item_text: 'Contract Type 5' },
      { item_id: 6, item_text: 'Contract Type 6' },
    ];

    this.selectedItems = [
      { item_id: 2, item_text: 'Maintenance' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };







  }
  onItemSelect(item: any) {
    console.log("this.selecteditems" + this.selectedItems);
    this.selectedTerritories += ",'" + item + "'";


    console.log(this.selectedTerritories);
    this.getData().then((res: any) => {
      console.log(res)
      this.drawchart1(res);
    });
  }

  onItemDeSelect(items: any) {
    console.log('Removed value is: ', items);
    var arr = this.selectedTerritories.split(',');
    arr = arr.filter(e => e !== "'" + items + "'");
    this.selectedTerritories = arr.join(', ').replace(/\s/g, '');
    console.log(this.selectedTerritories);
    this.getData().then((res: any) => {
      console.log(res)
      this.drawchart1(res);
    });
  }

  onSelectAll(items: any) {
    console.log(this.selectedItems);

    var input = items.toString();
    this.selectedTerritories = '\'' + input.split(',').join('\',\'') + '\'';
    console.log("this.selectedterritories" + this.selectedTerritories);

    console.log(this.selectedTerritories);
    this.getData().then((res: any) => {
      console.log(res)
      this.drawchart1(res);
    });

  }
  onDeSelectAll(items: any) {
    this.selectedTerritories = 'all';
    console.log(this.selectedTerritories);
    this.getData().then((res: any) => {
      console.log(res)
      this.drawchart1(res);

    });


  }


  //onselecr methods for Case Type Graph

  onCaseSelect(item: any) {
    console.log("this.selecteditems" + this.selectedItems);
    this.selectedTerritoriesCasetype += ",'" + item + "'";


    console.log(this.selectedTerritoriesCasetype);
    this.getCaseData().then((res: any) => {
      console.log(res)
      this.drawchart2(res);
    });
  }

  onCaseDeSelect(items: any) {
    console.log('Removed value is: ', items);
    var arr = this.selectedTerritoriesCasetype.split(',');
    arr = arr.filter(e => e !== "'" + items + "'");
    this.selectedTerritoriesCasetype = arr.join(', ').replace(/\s/g, '');
    console.log(this.selectedTerritoriesCasetype);
    this.getCaseData().then((res: any) => {
      console.log(res)
      this.drawchart2(res);
    });
  }

  onCaseSelectAll(items: any) {
    console.log(this.selectedItems);

    var input = items.toString();
    this.selectedTerritoriesCasetype = '\'' + input.split(',').join('\',\'') + '\'';
    console.log("this.selectedterritories" + this.selectedTerritoriesCasetype);

    console.log(this.selectedTerritoriesCasetype);
    this.getCaseData().then((res: any) => {
      console.log(res)
      this.drawchart2(res);
    });

  }
  onCaseDeSelectAll(items: any) {
    this.selectedTerritoriesCasetype = 'all';
    console.log(this.selectedTerritoriesCasetype);
    this.getCaseData().then((res: any) => {
      console.log(res)
      this.drawchart2(res);

    });


  }

//Static Graphs



public columnChartData2: any = {
  chartType: 'ColumnChart',
  dataTable: [
    ['Month', 'No. of Contracts', { role: 'annotation' }, { role: 'style' }],
    ['Jan', 30, 27, '#9D0CFF'],
    ['Feb', 7, 3, '#9D0CFF'],
    ['Mar', 10, 5, '#9D0CFF'],
    ['Apr', 20, 13, '#9D0CFF'],
    ['May', 48, 48, '#9D0CFF'],
    ['Jun', 56, 56, '#9D0CFF'],
    ['July', 0, 0, '#9D0CFF'],
    ['Aug', 0, 0, '#9D0CFF'],
    ['Sep', 0, 0, '#9D0CFF'],
    ['Oct', 0, 0, '#9D0CFF'],
    ['Nov', 0, 0, '#9D0CFF'],
    ['Dec', 0, 0, '#9D0CFF'],

  ],
  options: {
    title: 'Contracts Activated by Month',
    width: 900, height: 378,
    legend: { position: 'bottom', color: '#f13561' },
    series: {
      0: { color: '#9D0CFF' }
    }

  }
};


public barchart3: any = {
  chartType: 'BarChart',
  dataTable: [
    ['Country', '30 days delinquent', '60 days delinquent', '90 days delinquent', '120 days delinquent'],
    ['INPROG AWT RESOURCE', 30, 27, 23, 2],
    ['INPROG AWT CREDIT', 7, 13, 2, 22],
    ['INPROG AWT SSC', 10, 30, 24, 12],
    ['INPROG BUS UNITS', 20, 13, 44, 22],
    ['INPROG AWAITS 3PS', 30, 29, 12, 2],
    ['INPROG ACKNOWLEDGED', 20, 10, 22, 6],
    ['INSUFFICIENT DATA', 40, 23, 15, 7],
    ['INPROG', 25, 25, 33, 3],
    ['OPEN', 45, 45, 33, 3],
  ],
  options: {
    title: '',
    height: 500,
    series: {
      0: { color: '#444444', visibleInLegend: false },

      1: { color: '#2F65BD', visibleInLegend: false },
      2: { color: '#342BAF', visibleInLegend: false },
      3: { color: '#9900FF', visibleInLegend: false }
    }
  }
};


public pieChartData: any = {
  chartType: 'PieChart',
  dataTable: [
    ['Days', 'Hours per Day', { role: 'style' }],
    ['30 Days', 9, '#2F2BA6'],
    ['60 Days', 5, '#9C02FF'],
    ['90 Days', 2, '#9F2192'],
    ['120 Days', 1, '#2F2E6F']
  ],
  options: {
    title: '',
    is3D: true,
    width: 500,
    height: 500,
    legend: { position: 'bottom' },
    slices: {
      0: { color: '#2F2BA6' },
      1: { color: '#9C02FF' },
      2: { color: '#9F2192' },
      3: { color: '#2F2E6F' }
    }
  }
};



}
