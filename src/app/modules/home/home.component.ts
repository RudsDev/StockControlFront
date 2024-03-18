import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SignupUserRequest } from '../../models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from '../../models/interfaces/user/SignupUserRespose';
import { AuthRequest } from '../../models/interfaces/user/auth/AuthRequest';
import { UserService } from '../../services/users/user.service';
import { AuthResponse } from '../../models/interfaces/user/auth/AuthResponse';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  loginCard = true

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  private signupUserObservableHandler = {
    next: (resp: SignupUserResponse) => this.handleSuccessSignup(resp),
    error: (error: HttpErrorResponse) => this.handleErrorSignup(error)
  }

  private authUserObservableHandler = {
    next: (resp: AuthResponse) => this.handleSuccessAuth(resp),
    error: (error: HttpErrorResponse) => this.handleErrorAuth(error)
  }

  constructor(
    private router: Router,
    private formBuilder:FormBuilder,
    private userService:UserService,
    private cookieService: CookieService,
    private messageService: MessageService
  ){}

  onSubmitAuth():void {
    console.log(this.loginForm.value)
    if(this.loginForm.invalid) return
    this.userService
      .authUser(this.formToAuthRequest())
      .subscribe(this.authUserObservableHandler)

  }

  onSubmitSignup():void {
    console.log(this.signupForm.value)
    if(this.signupForm.invalid) return
    this.userService
      .signupUser(this.formToSignupUser())
      .subscribe(this.signupUserObservableHandler)
  }

  private formToAuthRequest(): AuthRequest {
    return {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    }
  }

  private formToSignupUser(): SignupUserRequest {
    return {
      name: this.signupForm.value.name!,
      email: this.signupForm.value.email!,
      password: this.signupForm.value.password!,
    }
  }

  private handleSuccessAuth(resp: AuthResponse):void {
    if(!resp) return
    this.cookieService.set(environment.USER_COOKIE, resp.token)
    this.loginForm.reset()
    this.router.navigate(['/dashboard'])
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Bem vindo de volta ${resp.name}!`,
      life: 2000
    });
  }

  private handleErrorAuth(error: HttpErrorResponse):void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao fazer login.',
      life: 2000
    });
    console.log(error.error)
  }

  private handleSuccessSignup(resp: SignupUserResponse):void {
    console.log(resp)
    this.signupForm.reset()
    this.loginCard = true
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Cadastro realizado com sucesso!`,
      life: 2000
    });
  }

  private handleErrorSignup(error: HttpErrorResponse):void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao realizar cadastro.',
      life: 2000
    });
    console.log(error.error)
  }

}
