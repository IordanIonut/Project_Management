import { Routes } from '@angular/router';
import { LoginComponent } from './_page/Authentication/login/login.component';
import { OtpComponent } from './_page/Authentication/otp/otp.component';
import { ChangePasswordComponent } from './_page/Authentication/change-password/change-password.component';
import { DashboardComponent } from './_page/Dashboard/dashboard/dashboard.component';
import { InformationComponent } from './_page/Dashboard/information/information.component';
import { CreateComponent } from './_page/Create/create/create.component';

export const routes: Routes = [
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'forgot-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'otp',
        component: OtpComponent,
      },
    ],
  },
  {
    path: 'dashboard',
    children: [
      { path: 'feed', component: DashboardComponent },
      {
        path: 'machine/:key', //the same like MACHINE on Segment enum
        component: InformationComponent,
      },
      {
        path: 'process/:key', //the same like PROCESS on Segment enum
        component: InformationComponent,
      },
      {
        path: 'car/:key', //the same like CAR on Segment enum
        component: InformationComponent,
      },
      {
        path: 'user/:key', //the same like CAR on Segment enum
        component: InformationComponent,
      },
      {
        path: 'quality/:key', //the same like QUALITY on Segment enum
        component: InformationComponent,
      }
    ],
  },
  {
    path: 'create',
    component: CreateComponent,
  },
];
