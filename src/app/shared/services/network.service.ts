import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private httpWithoutInterceptor: HttpClient;

  constructor(
    private http: HttpClient,
    private httpBackend: HttpBackend
  ) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  public get(url: string): Observable<any> {
    return this.http.get<any>(`${environment.URL}${url}`);
  }

  public put(url: string, body: any = {}): Observable<any> {
    return this.http.put<any>(`${environment.URL}${url}`, body);
  }

  public post(url: string, body: any): Observable<any> {
    return this.http.post<any>(`${environment.URL}${url}`, body);
  }

  public delete(url: string): Observable<any> {
    return this.http.delete<any>(`${environment.URL}${url}`);
  }

  public _get(url: string): Observable<any> {
    return this.httpWithoutInterceptor.get<any>(`${environment.URL}${url}`);
  }

  public _put(url: string, body: any = {}): Observable<any> {
    return this.httpWithoutInterceptor.put<any>(`${environment.URL}${url}`, body);
  }

  public _post(url: string, body: any): Observable<any> {
    return this.httpWithoutInterceptor.post<any>(`${environment.URL}${url}`, body);
  }

  public _delete(url: string): Observable<any> {
    return this.httpWithoutInterceptor.delete<any>(`${environment.URL}${url}`);
  }

}
