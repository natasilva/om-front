import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private url = environment.api
  constructor(private http: HttpClient) { }

  list(params: any = {}): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/ingredients`, { params });
  }

  create(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.url}/ingredients`, data);
  }
}
