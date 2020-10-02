import { Resource } from 'src/app/shared/models/resource';
import { NetworkService } from './network.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ResourceService<T extends Resource> {

  constructor(
    public endpoint: string,
    public networkService: NetworkService
  ) { }

  public list(): Observable<T[]> {
    return this.networkService
      .get(this.endpoint)
      .pipe(map((data: any) => Object.values(data)));
  }

  public create(item: T): Observable<T> {
    return this.networkService.post(this.endpoint, item);
  }

  public validate(item: T): Observable<T> {
    return this.networkService.post(`${this.endpoint}/validate`, item);
  }

  public read(id: number): Observable<T> {
    return this.networkService.get(`${this.endpoint}/${id}`);
  }

  public update(id: number, item: T): Observable<T> {
    return this.networkService.put(`${this.endpoint}/${id}`, item);
  }

  public delete(id: number): Observable<any> {
    return this.networkService.delete(`${this.endpoint}/${id}`);
  }

}
