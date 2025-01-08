import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = environment.api
  constructor(private http: HttpClient) { }

  list(params: any = {}): Observable<{ count: number, rows: any[] }> {
    return this.http.get<{ count: number, rows: any[] }>(`${this.url}/orders`, { params });
  }

  create(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.url}/orders`, data);
  }
}
