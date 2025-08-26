import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { filter, Observable } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AlertComponent } from './_service/_alert/alert/alert.component';
import { SpinnerComponent } from './_service/_spinner/spinner/spinner.component';
import { SpinnerService } from './_service/_spinner/spinner.service';
import { RolesLogicallyService } from './_shared/roles-logically.service';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    HttpClientModule,
    AlertComponent,
    SpinnerComponent,
  ],
  providers: [RolesLogicallyService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showNavbar = false;
  isAppReady = false;

  loading$: Observable<boolean>;

  constructor(
    private _spinnerService: SpinnerService,
    private router: Router,
    private _rolesLogically: RolesLogicallyService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.showNavbar = !event.urlAfterRedirects.includes('authentication');
        this.isAppReady = true;
        this.titleService.setTitle('CarFactory');
      });

    this.loading$ = this._spinnerService.loading$;
  }
}
