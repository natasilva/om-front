import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrinkService {
  private url = environment.api
  constructor(private http: HttpClient) { }

  list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/drinks`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.url}/drinks`, data);
  }
}
