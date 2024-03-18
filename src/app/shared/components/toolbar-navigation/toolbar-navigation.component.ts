import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrl: './toolbar-navigation.component.scss'
})
export class ToolbarNavigationComponent {

  constructor(
    private cookieService: CookieService,
    private router: Router,
  ) {}

  handleLogout():void {
    this.cookieService.delete(environment.USER_COOKIE)
    void this.router.navigate(['/home'])
  }

}
