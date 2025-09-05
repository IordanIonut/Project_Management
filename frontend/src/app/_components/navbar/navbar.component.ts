import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Environment } from '../../../environments/environment';
import { JwtService } from '../../_service/_http/jwt.service';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../_service/_model/user.service';
import { RolesLogicallyService } from '../../_shared/roles-logically.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ICONS } from '../../_shared/icons';
import { DialogService } from '../../_service/_dialog/dialog.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatOptionModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
  ],
  providers: [UserService, RolesLogicallyService, DialogService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  routes: NavItem[] = [
    { name: 'Dashboard', route: '/dashboard/feed', icon: ICONS.HOME },
    // {
    //   name: 'Employees',
    //   route: '/dashboard/employee',
    //   icon: ICONS.EMPLOYEE,
    // },
    // { name: 'Cars', route: '/dashboard/cars', icon: ICONS.CAR },
    // { name: 'Processes', route: '/dashboard/processes', icon: ICONS.PROCESS },
  ];

  feet: NavItem = this.routes[0];
  name!: string;
  ICONS: typeof ICONS = ICONS;

  showSearchFeature!: boolean;
  constructor(
    private _jwtService: JwtService,
    private _router: Router,
    private _dialogService: DialogService,
    public _roleLogically: RolesLogicallyService
  ) {
    this.name = this._jwtService.getUserInfo()?.name!;
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  onSelect(value: string | null) {
    if (this._router.url === '/dashboard/projects/' + value) {
      this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this._router.navigateByUrl('/dashboard/projects/' + value);
      });
    } else {
      this._router.navigateByUrl('/dashboard/projects/' + value);
    }
  }

  onViewUser() {
    this._router.navigateByUrl(
      '/dashboard/user/' + this._jwtService.getUserInfo()?.name
    );
  }

  onAddPage() {
    this._router.navigateByUrl('/create');
  }

  onOpenSearchDialog() {
    this._dialogService.openDialogSearch();
  }

  onLogout() {
    this._jwtService.logout(Environment.jwtToken);
    window.location.href = '/authentication/login';
  }
}

interface NavItem {
  name: string;
  route: string;
  icon: string;
}
