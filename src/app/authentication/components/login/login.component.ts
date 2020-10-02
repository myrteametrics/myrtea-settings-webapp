import { Component, OnInit } from '@angular/core';
import { ImagesPaths } from 'src/app/shared/constants/images-path';
import { Icons } from 'src/app/shared/constants/icons';
import { AuthService } from '../../services/auth.service';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public icons = Icons;
  public imagesPaths = ImagesPaths;
  public formControl = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() { }

  public login() {
    if (this.formControl.valid) {
      this.authService.login(this.formControl.value.login, this.formControl.value.password);
    }
  }

}
