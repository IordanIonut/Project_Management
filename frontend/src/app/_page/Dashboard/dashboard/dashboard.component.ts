import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from '../../../_components/card/card.component';
import { CommonModule } from '@angular/common';
import { NamePage } from '../../../_components/name-page/name-page';
import { NamePageComponent } from '../../../_components/name-page/name-page.component';
import { ICONS } from '../../../_shared/icons';
import {
  Dashboard_And_User_Page,
  GenerateTableKeys,
} from '../../../_components/generate-table/generate-table-key';
import { GenerateTableComponent } from '../../../_components/generate-table/generate-table.component';
import { MatCardModule } from '@angular/material/card';
import { CarsModelService } from '../../../_service/_model/car-model.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    NamePageComponent,
    MatCardModule,
    GenerateTableComponent,
  ],
  providers: [CarsModelService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  type: boolean = true;

  page: NamePage = {
    name: 'Dashboard Overview',
    icon: ICONS.FEET,
  };

  keys: GenerateTableKeys[] = Dashboard_And_User_Page;
  // [
  //   // ...Object.values(GenerateTableKeys),
  // ];

  constructor() {}

  onType(event: boolean) {
    this.type = event;
  }
}
