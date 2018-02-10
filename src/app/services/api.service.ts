import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Injectable()
export class ApiService {
  configUrl = "https://uinames.com/api/?ext";
  constructor(private _http: HttpClient) { }
  getUinames() {
    return this._http.get(this.configUrl);
  }

}
