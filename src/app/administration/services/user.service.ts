import { Injectable } from '@angular/core';
import { NetworkService } from 'src/app/shared/services/network.service';
import { ResourceService } from 'src/app/shared/services/resource.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ResourceService<User> {

  constructor(
    public networkService: NetworkService,
  ) {
    super(
      '/admin/security/users',
      networkService
    );
  }

}
