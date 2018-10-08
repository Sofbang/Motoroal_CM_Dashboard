import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DemoService {

    constructor(private http:HttpClient) {
    }

    // NOTE: all API calls in this file use simple endpoints served by
    // an Express app in the file app.js in the repo root. See that file
    // for all back-end code.

    // Uses http.get() to load data from a single API endpoint
    getContracts(territory) {
        return this.http.get('cm_dashboard_api/v1/contract_state?territory='+territory);
    }

    getTerritories() {
        return this.http.get('cm_dashboard_api/v1/territories');
    }
    // Uses Observable.forkJoin() to run multiple concurrent http.get() requests.
    // The entire operation will result in an error state if any single request fails.
    getCases(territory) {
        return this.http.get('cm_dashboard_api/v1/case_status?territory='+territory);
    }

    
    getCaseStatusTerritories() {
        return this.http.get('cm_dashboard_api/v1/case_territories');
    }

    getBatchTime() {
        return this.http.get('cm_dashboard_api/v1/batchtime');
    }

    }




