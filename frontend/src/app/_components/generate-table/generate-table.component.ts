import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TableComponent } from './table/table.component';
import { JwtService } from '../../_service/_http/jwt.service';
import { RolesLogicallyService } from '../../_shared/roles-logically.service';
import { ProcessLogService } from '../../_service/_model/process-log.service';
import { QualityChecksService } from '../../_service/_model/quality-checks.service';
import { UserService } from '../../_service/_model/user.service';
import { CarsService } from '../../_service/_model/cars.service';
import { MachineService } from '../../_service/_model/machine.service';
import { CarsPartsService } from '../../_service/_model/cars-parts.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { isProcessLog, ProcessLog } from '../../_model/_interface/process-log';
import { Cars, isCars } from '../../_model/_interface/car';
import { isQualityCheck } from '../../_model/_interface/quality-checks';
import { isCarsParts } from '../../_model/_interface/cars-parts';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Card } from '../card/card';
import { ICONS } from '../../_shared/icons';
import { SortPage } from '../../_model/_common/sort-page';
import { ChangePage } from '../../_model/_common/change-page';
import { Environment } from '../../../environments/environment';
import { ExcelExportService } from '../../_service/_excel/excel.service';
import { DialogService } from '../../_service/_dialog/dialog.service';
import { UserInformationDTO } from '../../_model/_dto/user-information-dto';
import { GenerateTableKeys } from './generate-table-key';
import { TableColumn } from '../../_model/_common/table-column';
import { ProcessLogStatus } from '../../_model/_enum/process-log-status';
import { ProcessLogsFilterDTO } from '../../_model/_dto/process-log-filter-dto';
import { CarsFiltersDTO } from '../../_model/_dto/cars-filter-dto';
import { QualityChecksFiltersDTO } from '../../_model/_dto/quality-check-filter-dto';
import { CarsPartsFilterDTO } from '../../_model/_dto/cars-parts-filter-dto';
import { MachineUsedFiltersDTO } from '../../_model/_dto/machine-used-filters-dto';
import { MachineStatus } from '../../_model/_enum/machine-status';
import { ViewType } from '../../_dialog/view-type';
import { CarsStatus } from '../../_model/_enum/cars-status';
import { PartCategory } from '../../_model/_enum/part-category';
import { PartProductionService } from '../../_service/_model/part-production.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isPartProduction } from '../../_model/_interface/part-production';
import { PartProductionFiltersDTO } from '../../_model/_dto/part_production-filter-dto';
import { Urls } from '../../_shared/urls';
import { MachineFiltersDTO } from '../../_model/_dto/machine-filters-dto';
import { UserRole } from '../../_model/_enum/user-role';
import { MachineAllFiltersDTO } from '../../_model/_dto/machine-all-filter.dto';
import { GenerateType } from './generate-type';
import { UserAllFiltersDTO } from '../../_model/_dto/user-all-filters-dto';
import { CarModelFilterDTO } from '../../_model/_dto/car-model-filter-dto';
import { CarsModelService } from '../../_service/_model/car-model.service';

@Component({
  selector: 'app-generate-table',
  standalone: true,
  imports: [
    HttpClientModule,
    CardComponent,
    CommonModule,
    MatCardModule,
    TableComponent,
  ],
  providers: [
    JwtService,
    RolesLogicallyService,
    ProcessLogService,
    QualityChecksService,
    UserService,
    CarsService,
    MachineService,
    CarsPartsService,
    PartProductionService,
  ],
  templateUrl: './generate-table.component.html',
  styleUrl: './generate-table.component.scss',
})
export class GenerateTableComponent {
  @Input() keys!: GenerateTableKeys[];
  @Input() type: boolean = true;
  @Input() isHidden: boolean = false;
  @Input() isHiddenCards: boolean = false;

  @Output() eventRow: EventEmitter<GenerateType> =
    new EventEmitter<GenerateType>();
  @Output() eventCard: EventEmitter<Card> = new EventEmitter<Card>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  data!: GenerateType[];
  count!: number;
  card!: Card;
  form!: { [key: string]: FormGroup };

  cards: { [key: string]: Card } = {
    [GenerateTableKeys.PROCESS_LOG]: {
      name: GenerateTableKeys.PROCESS_LOG,
      count: 0,
      icon: ICONS.PROCESS,
      color: 'green',
    },
    [GenerateTableKeys.CARS]: {
      name: GenerateTableKeys.CARS,
      count: 0,
      icon: ICONS.CAR,
      color: 'blue',
    },
    [GenerateTableKeys.QUALITY_CHECKS]: {
      name: GenerateTableKeys.QUALITY_CHECKS,
      count: 0,
      icon: ICONS.QUALITY_CHECKS,
      color: 'purple',
    },
    [GenerateTableKeys.ASSIGNED_PARTS]: {
      name: GenerateTableKeys.ASSIGNED_PARTS,
      count: 0,
      icon: ICONS.PARTS,
      color: 'orange',
    },
    [GenerateTableKeys.MACHINE_USED]: {
      name: GenerateTableKeys.MACHINE_USED,
      count: 0,
      icon: ICONS.MACHINE,
      color: 'gray',
    },
    [GenerateTableKeys.PART_PRODUCTION_BY_MACHINE]: {
      name: GenerateTableKeys.PART_PRODUCTION_BY_MACHINE,
      count: 0,
      icon: ICONS.PART_PRODUCTION,
      color: 'red',
    },
    [GenerateTableKeys.MACHINE_PAGE]: {
      name: GenerateTableKeys.MACHINE_PAGE,
      count: 0,
      icon: ICONS.MACHINE,
      color: 'blue',
    },
    [GenerateTableKeys.USER_ALL]: {
      name: GenerateTableKeys.USER_ALL,
      count: 0,
      icon: ICONS.EMPLOYEE,
      color: 'blue',
    },
    [GenerateTableKeys.MACHINE_ALL]: {
      name: GenerateTableKeys.MACHINE_ALL,
      count: 0,
      icon: ICONS.MACHINE,
      color: 'red',
    },
    [GenerateTableKeys.CAR_ALL]: {
      name: GenerateTableKeys.CAR_ALL,
      count: 0,
      icon: ICONS.CAR,
      color: 'green',
    },
    [GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME]: {
      name: GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME,
      count: 0,
      icon: ICONS.PROCESS,
      color: 'yellow',
    },
    [GenerateTableKeys.CARS_MODEL_ALL]: {
      name: GenerateTableKeys.CARS_MODEL_ALL,
      count: 0,
      icon: ICONS.CAR_MODEL,
      color: 'blue',
    },
  };

  columnsSettings: {
    [key: string]: TableColumn[];
  } = {
    [GenerateTableKeys.PROCESS_LOG]: [
      {
        key: 'status',
        code: 'p.status',
        label: 'Status',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Status',
          formControlName: 'status',
          options: ['NONE', ...Object.keys(ProcessLogStatus)],
          labelKey: null,
          valueKey: null,
        },
      },
      {
        key: 'process_id.name',
        code: 'p.process_id.name',
        label: 'Process',
        type: 'link',
        link: Urls.PROCESS_ID,
        config: {
          type: 'text',
          placeholder: 'Process',
          formControlName: 'process_id_name',
        },
      },
      {
        key: 'machine_id.name',
        code: 'p.machine_id.name',
        label: 'Machine Name',
        type: 'link',
        link: Urls.MACHINE_NAME,
        config: {
          type: 'text',
          placeholder: 'Machine Name',
          formControlName: 'machine_id_name',
        },
      },
      {
        key: 'start_time',
        code: 'p.start_time',
        label: 'Start Date',
        pipe: 'date',
        isActive: false,
        config: {
          type: 'date',
          placeholder: 'Start Date',
          formControlName: 'start_time',
        },
      },
      {
        key: 'end_time',
        code: 'p.end_time',
        label: 'End Date',
        pipe: 'date',
        isActive: true,
        config: {
          type: 'date',
          placeholder: 'End Date',
          formControlName: 'end_time',
        },
      },
      {
        key: 'view',
        code: 'view',
        label: 'View',
        type: 'button',
        activeFilters: true,
        buttons: [
          {
            icon: ICONS.PIE,
            buttonColor: 'primary',
            onClick: (row: ProcessLog) => {
              this._dialogService.openDialogViewChart(
                row,
                ViewType.PROCESS_LOG,
                'Process Log By Machine'
              );
            },
          },
          {
            icon: ICONS.LINE,
            buttonColor: 'primary',
            onClick: (row: ProcessLog) => {
              this._dialogService.openDialogViewLine(
                row,
                ViewType.PROCESS_LOG,
                'Process Log By Machine'
              );
            },
          },
          {
            icon: ICONS.POLAR,
            buttonColor: 'primary',
            onClick: (row: ProcessLog) => {
              this._dialogService.openDialogViewPolar(
                row,
                ViewType.PROCESS_LOG,
                'Process Log By Machine'
              );
            },
          },
        ],
      },
    ],
    [GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME]: [
      {
        key: 'status',
        code: 'p.status',
        label: 'Status',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Status',
          formControlName: 'status',
          options: ['NONE', ...Object.keys(ProcessLogStatus)],
          labelKey: null,
          valueKey: null,
        },
      },
      {
        key: 'process_id.name',
        code: 'p.process_id.name',
        label: 'Process',
        type: 'link',
        link: Urls.PROCESS_ID,
        config: {
          type: 'text',
          placeholder: 'Process',
          formControlName: 'process_id_name',
        },
      },
      {
        key: 'machine_id.name',
        code: 'p.machine_id.name',
        label: 'Machine Name',
        type: 'link',
        link: Urls.MACHINE_NAME,
        config: {
          type: 'text',
          placeholder: 'Machine Name',
          formControlName: 'machine_id_name',
        },
      },
      {
        key: 'start_time',
        code: 'p.start_time',
        label: 'Start Date',
        pipe: 'date',
        isActive: false,
        config: {
          type: 'date',
          placeholder: 'Start Date',
          formControlName: 'start_time',
        },
      },
      {
        key: 'end_time',
        code: 'p.end_time',
        label: 'End Date',
        pipe: 'date',
        isActive: true,
        config: {
          type: 'date',
          placeholder: 'End Date',
          formControlName: 'end_time',
        },
      },
      {
        key: 'view',
        code: 'view',
        label: 'View',
        type: 'button',
        activeFilters: true,
        buttons: [
          {
            icon: ICONS.PIE,
            buttonColor: 'primary',
            onClick: (row: ProcessLog) => {
              this._dialogService.openDialogViewChart(
                row,
                ViewType.PROCESS_LOG,
                'Process Log By Machine'
              );
            },
          },
          {
            icon: ICONS.LINE,
            buttonColor: 'primary',
            onClick: (row: ProcessLog) => {
              this._dialogService.openDialogViewLine(
                row,
                ViewType.PROCESS_LOG,
                'Process Log By Machine'
              );
            },
          },
          {
            icon: ICONS.POLAR,
            buttonColor: 'primary',
            onClick: (row: ProcessLog) => {
              this._dialogService.openDialogViewPolar(
                row,
                ViewType.PROCESS_LOG,
                'Process Log By Machine'
              );
            },
          },
        ],
      },
    ],
    [GenerateTableKeys.CARS]: [
      {
        key: 'model_id.name',
        code: 'c.model_id.name',
        label: 'Name',
        type: 'link',
        link: Urls.CARS_NAME,
        config: {
          type: 'text',
          placeholder: 'Name',
          formControlName: 'model_id_name',
        },
      },
      {
        key: 'model_id.generation',
        code: 'c.model_id.generation',
        label: 'Generation',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Generation',
          formControlName: 'model_id_generation',
        },
      },
      {
        key: 'vin',
        code: 'c.vin',
        label: 'VIN',
        type: 'link',
        link: Urls.CARS_VIN,
        config: {
          type: 'text',
          placeholder: 'VIN',
          formControlName: 'vin',
        },
      },
      {
        key: 'status',
        code: 'c.status',
        label: 'Status',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Status',
          formControlName: 'status',
          options: ['NONE', ...Object.keys(CarsStatus)],
        },
      },
      {
        key: 'model_id.release_year',
        code: 'c.model_id.release_year',
        label: 'Release Year',
        type: 'text',
        config: {
          type: 'number',
          placeholder: 'Release Year',
          formControlName: 'model_id_release_year',
        },
      },
      {
        key: 'view',
        code: 'view',
        label: 'View',
        type: 'button',
        buttons: [
          {
            icon: ICONS.PIE,
            buttonColor: 'primary',
            onClick: (row: Cars) => {
              this._dialogService.openDialogViewChart(
                row,
                ViewType.CARS,
                'Cars Model Count'
              );
            },
          },
          {
            icon: ICONS.LINE,
            buttonColor: 'primary',
            onClick: (row: Cars) => {
              this._dialogService.openDialogViewLine(
                row,
                ViewType.CARS,
                'Cars Model Count'
              );
            },
          },
          {
            icon: ICONS.POLAR,
            buttonColor: 'primary',
            onClick: (row: Cars) => {
              this._dialogService.openDialogViewPolar(
                row,
                ViewType.CARS,
                'Cars Model Count'
              );
            },
          },
        ],
      },
    ],
    [GenerateTableKeys.QUALITY_CHECKS]: [
      {
        key: 'car_id.model_id.name',
        code: 'qc.car_id.model_id.name',
        label: 'Name',
        type: 'link',
        link: Urls.CARS_ID_NAME,
        config: {
          type: 'text',
          placeholder: 'Name',
          formControlName: 'car_id_model_id_name',
        },
      },
      {
        key: 'car_id.model_id.generation',
        code: 'qc.car_id.model_id.generation',
        label: 'Generation',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Generation',
          formControlName: 'car_id_model_id_generation',
        },
      },
      {
        key: 'car_id.model_id.release_year',
        code: 'qc.car_id.model_id.release_year',
        label: 'Release Year',
        type: 'text',
        config: {
          type: 'number',
          placeholder: 'Release Year',
          formControlName: 'car_id_model_id_release_year',
        },
      },
      {
        key: 'inspector_id.name',
        code: 'qc.inspector_id.name',
        label: 'Inspector',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Inspector',
          formControlName: 'inspector_id_name',
        },
      },
      {
        key: 'car_id.status',
        code: 'qc.car_id.status',
        label: 'Status',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Status',
          formControlName: 'car_id_status',
          options: ['NONE', ...Object.keys(CarsStatus)],
        },
      },
      {
        key: 'check_date',
        code: 'qc.check_date',
        label: 'Check Date',
        pipe: 'date',
        config: {
          type: 'date',
          placeholder: 'Check Date',
          formControlName: 'check_date',
        },
      },
      {
        key: 'passed',
        code: 'qc.passed',
        label: 'Passed',
        passed: true,
        config: {
          type: 'select',
          placeholder: 'Passed',
          formControlName: 'passed',
          options: ['NONE', 'TRUE', 'FALSE'],
          labelKey: null,
          valueKey: null,
        },
      },
    ],
    [GenerateTableKeys.ASSIGNED_PARTS]: [
      {
        key: 'car_id.model_id.name',
        code: 'cp.car_id.model_id.name',
        label: 'Car Name',
        type: 'link',
        link: Urls.CARS_ID_NAME,
        config: {
          type: 'text',
          placeholder: 'Car Name',
          formControlName: 'car_id_model_id_name',
        },
      },
      {
        key: 'part_id.name',
        code: 'cp.part_id.name',
        label: 'Part Name',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Part Name',
          formControlName: 'part_id_name',
        },
      },
      {
        key: 'part_id.category',
        code: 'cp.part_id.category',
        label: 'Part Category',
        type: 'text',
        config: {
          type: 'select',
          options: ['NONE', ...Object.keys(PartCategory)],
          labelKey: null,
          valueKey: null,
          placeholder: 'Part Category',
          formControlName: 'part_id_category',
        },
      },
      {
        key: 'installed_by.name',
        code: 'cp.installed_by.name',
        label: 'Installed',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Installed',
          formControlName: 'installed_by_name',
        },
      },
      {
        key: 'quantity',
        code: 'cp.quantity',
        label: 'Quantity',
        type: 'text',
        config: {
          type: 'number',
          placeholder: 'Quantity',
          formControlName: 'quantity',
        },
      },
      {
        key: 'part_id.unit_cost',
        code: 'cp.part_id.unit_cost',
        label: 'Part unit_cost',
        type: 'text',
        config: {
          type: 'number',
          placeholder: 'Part unit_cost',
          formControlName: 'part_id_unit_cost',
        },
      },
    ],
    [GenerateTableKeys.MACHINE_USED]: [
      {
        key: 'machine_id.name',
        code: 'pl.machine_id.name',
        label: 'Machine Name',
        type: 'link',
        link: Urls.MACHINE_NAME,
        config: {
          type: 'text',
          placeholder: 'Machine Name',
          formControlName: 'machine_id_name',
        },
      },
      {
        key: 'machine_id.status',
        code: 'pl.machine_id.status',
        label: 'Machine Status',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Machine Status',
          formControlName: 'machine_id_status',
          options: ['NONE', ...Object.keys(MachineStatus)],
        },
      },
      {
        key: 'car_id.model_id.name',
        code: 'pl.car_id.model_id.name',
        label: 'Car Name',
        type: 'link',
        link: Urls.CARS_NAME,
        config: {
          type: 'text',
          placeholder: 'Car Name',
          formControlName: 'car_id_model_id_name',
        },
      },
      {
        key: 'status',
        code: 'pl.status',
        label: 'Status',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Status',
          formControlName: 'status',
          options: ['NONE', ...Object.keys(ProcessLogStatus)],
        },
      },
      {
        key: 'process_id.name',
        code: 'pl.process_id.name',
        label: 'Process Name',
        type: 'link',
        link: Urls.PROCESS_ID,
        config: {
          type: 'text',
          placeholder: 'Process Name',
          formControlName: 'process_id_name',
        },
      },
      {
        key: 'employee_id.user_id.username',
        code: 'pl.employee_id.user_id.username',
        label: 'User Name',
        type: 'link',
        link: Urls.USER_EMPLOYEE_NAME,
        config: {
          type: 'text',
          placeholder: 'User Name',
          formControlName: 'employee_id_user_id_username',
        },
      },
      {
        key: 'view',
        code: 'view',
        label: 'View',
        type: 'button',
        activeFilters: true,
        buttons: [
          {
            icon: ICONS.PIE,
            buttonColor: 'primary',
            onClick: (row: ProcessLog) => {
              this._dialogService.openDialogViewChart(
                row,
                ViewType.PROCESS_LOG,
                'Process Log By Machine'
              );
            },
          },
          {
            icon: ICONS.LINE,
            buttonColor: 'primary',
            onClick: (row: ProcessLog) => {
              this._dialogService.openDialogViewLine(
                row,
                ViewType.PROCESS_LOG,
                'Process Log By Machine'
              );
            },
          },
          {
            icon: ICONS.POLAR,
            buttonColor: 'primary',
            onClick: (row: ProcessLog) => {
              this._dialogService.openDialogViewPolar(
                row,
                ViewType.PROCESS_LOG,
                'Process Log By Machine'
              );
            },
          },
        ],
      },
    ],
    [GenerateTableKeys.PART_PRODUCTION_BY_MACHINE]: [
      {
        key: 'part_id.name',
        code: 'pp.part_id.name',
        label: 'Part Name',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Part Name',
          formControlName: 'part_id_name',
        },
      },
      {
        key: 'part_id.category',
        code: 'pp.part_id.category',
        label: 'Part Category',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Part Category',
          formControlName: 'part_id_category',
          options: ['NONE', ...Object.keys(PartCategory)],
        },
      },
      {
        key: 'produced_date',
        code: 'pp.produced_date',
        label: 'Produced Date',
        pipe: 'date',
        config: {
          type: 'date',
          placeholder: 'Produced Date',
          formControlName: 'produced_date',
        },
      },
      {
        key: 'quantity',
        code: 'pp.quantity',
        label: 'Quantity',
        type: 'text',
        config: {
          type: 'number',
          placeholder: 'Quantity',
          formControlName: 'quantity',
        },
      },
      {
        key: 'part_id.unit_cost',
        code: 'pp.part_id.unit_cost',
        label: 'Unit Cost',
        type: 'text',
        config: {
          type: 'number',
          placeholder: 'Unit Cost',
          formControlName: 'part_id_unit_cost',
        },
      },
    ],
    [GenerateTableKeys.MACHINE_PAGE]: [
      {
        key: 'employee_id.user_id.username',
        code: 'p.employee_id.user_id.username',
        label: 'Username',
        type: 'link',
        link: Urls.USER_EMPLOYEE_NAME,
        config: {
          type: 'text',
          placeholder: 'Username',
          formControlName: 'employee_id_user_id_username',
        },
      },
      {
        key: 'employee_id.user_id.role',
        code: 'p.employee_id.user_id.role',
        label: 'Role',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Role',
          formControlName: 'employee_id_user_id_role',
          options: ['NONE', ...Object.keys(UserRole)],
        },
      },
      {
        key: 'process_id.name',
        code: 'p.process_id.name',
        label: 'Process Name',
        type: 'link',
        link: Urls.PROCESS_ID,
        config: {
          type: 'text',
          placeholder: 'Process Name',
          formControlName: 'process_id_name',
        },
      },
      {
        key: 'employee_id.department',
        code: 'p.employee_id.department',
        label: 'Department',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Department',
          formControlName: 'employee_id_department',
        },
      },
      {
        key: 'start_time',
        code: 'p.start_time',
        label: 'Start Date',
        isActive: false,
        pipe: 'date',
        config: {
          type: 'date',
          placeholder: 'Start Date',
          formControlName: 'start_time',
        },
      },
      {
        key: 'end_time',
        code: 'p.end_time',
        label: 'End Date',
        pipe: 'date',
        isActive: true,
        config: {
          type: 'date',
          placeholder: 'End Date',
          formControlName: 'end_time',
        },
      },
      {
        key: 'status',
        code: 'p.status',
        label: 'Status',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Status',
          formControlName: 'status',
          options: ['NONE', ...Object.keys(ProcessLogStatus)],
        },
      },
    ],
    [GenerateTableKeys.USER_ALL]: [
      {
        key: 'username',
        code: 'u.username',
        label: 'Username',
        type: 'link',
        link: Urls.USER_NAME,
        config: {
          type: 'text',
          placeholder: 'Username',
          formControlName: 'username',
        },
      },
      {
        key: 'email',
        code: 'u.email',
        label: 'Email',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Email',
          formControlName: 'email',
        },
      },
      {
        key: 'role',
        code: 'u.role',
        label: 'Role',
        type: 'text',
        config: {
          type: 'select',
          options: ['NONE', ...Object.values(UserRole)],
          placeholder: 'Role',
          formControlName: 'role',
        },
      },
      {
        key: 'employees_id.name',
        code: 'u.employees_id.name',
        label: 'Employee Name',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Employee Name',
          formControlName: 'employees_id_name',
        },
      },
    ],
    [GenerateTableKeys.MACHINE_ALL]: [
      {
        key: 'name',
        code: 'm.name',
        label: 'Name',
        type: 'link',
        link: Urls.MACHINE_DISPLAY_NAME,
        config: {
          type: 'text',
          placeholder: 'Name',
          formControlName: 'name',
        },
      },
      {
        key: 'type',
        code: 'm.type',
        label: 'Type',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Type',
          formControlName: 'type',
        },
      },
      {
        key: 'status',
        code: 'm.status',
        type: 'text',
        label: 'Status',
        config: {
          type: 'select',
          placeholder: 'Status',
          formControlName: 'status',
          options: ['NONE', ...Object.keys(MachineStatus)],
        },
      },
      {
        key: 'last_maintenance',
        code: 'm.last_maintenance',
        isActive: true,
        pipe: 'date',
        label: 'Last Maintenance',
        config: {
          type: 'date',
          placeholder: 'Last Maintenance',
          formControlName: 'last_maintenance',
        },
      },
    ],
    [GenerateTableKeys.CAR_ALL]: [
      {
        key: 'model_id.name',
        code: 'c.model_id.name',
        label: 'Name',
        type: 'link',
        link: Urls.CARS_NAME,
        config: {
          type: 'text',
          placeholder: 'Name',
          formControlName: 'model_id_name',
        },
      },
      {
        key: 'model_id.generation',
        code: 'c.model_id.generation',
        label: 'Generation',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Generation',
          formControlName: 'model_id_generation',
        },
      },
      {
        key: 'vin',
        code: 'c.vin',
        label: 'VIN',
        type: 'link',
        link: Urls.CARS_VIN,
        config: {
          type: 'text',
          placeholder: 'VIN',
          formControlName: 'vin',
        },
      },
      {
        key: 'status',
        code: 'c.status',
        label: 'Status',
        type: 'text',
        config: {
          type: 'select',
          placeholder: 'Status',
          formControlName: 'status',
          options: ['NONE', ...Object.keys(CarsStatus)],
        },
      },
      {
        key: 'model_id.release_year',
        code: 'c.model_id.release_year',
        label: 'Release Year',
        type: 'text',
        config: {
          type: 'number',
          placeholder: 'Release Year',
          formControlName: 'model_id_release_year',
        },
      },
      {
        key: 'view',
        code: 'view',
        label: 'View',
        type: 'button',
        buttons: [
          {
            icon: ICONS.PIE,
            buttonColor: 'primary',
            onClick: (row: Cars) => {
              this._dialogService.openDialogViewChart(
                row,
                ViewType.CARS,
                'Cars Model Count'
              );
            },
          },
          {
            icon: ICONS.LINE,
            buttonColor: 'primary',
            onClick: (row: Cars) => {
              this._dialogService.openDialogViewLine(
                row,
                ViewType.CARS,
                'Cars Model Count'
              );
            },
          },
          {
            icon: ICONS.POLAR,
            buttonColor: 'primary',
            onClick: (row: Cars) => {
              this._dialogService.openDialogViewPolar(
                row,
                ViewType.CARS,
                'Cars Model Count'
              );
            },
          },
        ],
      },
    ],
    [GenerateTableKeys.CARS_MODEL_ALL]: [
      {
        key: 'name',
        code: 'cm.name',
        label: 'Name',
        type: 'text',
        config: {
          type: 'text',
          placeholder: 'Name',
          formControlName: 'name',
        },
      },
      {
        key: 'generation',
        code: 'cm.generation',
        label: 'Generation',
        type: 'text',
        config: {
          type: 'number',
          placeholder: 'Generation',
          formControlName: 'generation',
        },
      },
      {
        key: 'release_year',
        code: 'cm.release_year',
        label: 'Release Year',
        type: 'text',
        config: {
          type: 'number',
          formControlName: 'release_year',
          placeholder: 'Release Year',
        },
      },
    ],
  };

  cardSettings: {
    [key: string]: {
      sortPage: SortPage;
      changePage: ChangePage;
    };
  } = {
    [GenerateTableKeys.PROCESS_LOG]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.PROCESS_LOG][0].key,
        direction: '',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.CARS]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.CARS][0].key,
        direction: '',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.QUALITY_CHECKS]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.QUALITY_CHECKS][0].key,
        direction: '',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.ASSIGNED_PARTS]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.ASSIGNED_PARTS][0].key,
        direction: '',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.MACHINE_USED]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.MACHINE_USED][0].key,
        direction: '',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.PART_PRODUCTION_BY_MACHINE]: {
      sortPage: {
        column:
          this.columnsSettings[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE][0]
            .key,
        direction: 'asc',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.MACHINE_PAGE]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.MACHINE_PAGE][0].key,
        direction: 'asc',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.USER_ALL]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.USER_ALL][0].key,
        direction: 'asc',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.MACHINE_ALL]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.MACHINE_ALL][0].key,
        direction: 'asc',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.CAR_ALL]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.CAR_ALL][0].key,
        direction: 'asc',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME]: {
      sortPage: {
        column:
          this.columnsSettings[
            GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
          ][0].key,
        direction: 'asc',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
    [GenerateTableKeys.CARS_MODEL_ALL]: {
      sortPage: {
        column: this.columnsSettings[GenerateTableKeys.CARS_MODEL_ALL][0].key,
        direction: 'asc',
      },
      changePage: { pageIndex: 0, pageSize: Environment.pageSize },
    },
  };

  constructor(
    private _excelService: ExcelExportService,
    private _JwtService: JwtService,
    private _processLogService: ProcessLogService,
    private _qualityChecksService: QualityChecksService,
    private _carsService: CarsService,
    private _userService: UserService,
    private _carsPartsService: CarsPartsService,
    private _partProductionService: PartProductionService,
    private _machineService: MachineService,
    private _dialogService: DialogService,
    private _carModelService: CarsModelService,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    this.onDefaultForms();
    this.onInformation();
  }

  ngOnInit() {
    this.onCardClick(this.cards[this.keys[0]]!);
  }

  onInformation() {
    this._userService
      .countInformation(this.getUsername!, this.getUsernameDifferentParams!)
      .subscribe({
        next: (response: UserInformationDTO) => {
          this.cards[GenerateTableKeys.PROCESS_LOG].count =
            response.countProcessLog;
          this.cards[
            GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
          ].count = response.countProcessLog;
          this.cards[GenerateTableKeys.CARS].count = response.countCars;
          this.cards[GenerateTableKeys.QUALITY_CHECKS].count =
            response.countQualityChecks;
          this.cards[GenerateTableKeys.ASSIGNED_PARTS].count =
            response.countAssignedParts;
          this.cards[GenerateTableKeys.MACHINE_USED].count =
            response.countMachineUsed;
          this.cards[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].count =
            response.countByPartProduction;
          this.cards[GenerateTableKeys.MACHINE_PAGE].count =
            response.countByMachine;
          this.cards[GenerateTableKeys.USER_ALL].count = response.countAllUsers;
          this.cards[GenerateTableKeys.MACHINE_ALL].count =
            response.countAllMachine;
          this.cards[GenerateTableKeys.CAR_ALL].count = response.countAllCars;
          this.cards[GenerateTableKeys.CARS_MODEL_ALL].count =
            response.countAllCarModels;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  onSortChanged(sort: any) {
    this.cardSettings[this.card.name].sortPage = { ...sort };
    this.onCardClick(this.card);
  }

  onPageChanged(page: any) {
    this.cardSettings[this.card.name].changePage = { ...page };
    this.onCardClick(this.card);
  }

  onExport() {
    const columns = this.onColumns()
      .map((col) => col.code)
      .filter((code) => code && code !== 'view');
    const tables = this.onColumns()
      .map((col) => col.label)
      .filter((label) => label && label !== 'View');

    switch (this.card.name) {
      case GenerateTableKeys.PROCESS_LOG:
      case GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME: {
        this._processLogService
          .postExcelByUserNameAndProcessLogIdAndProcessLogFilters(
            this.getUsername!,
            this.getUsernameDifferentParams!,
            columns.join(', '),
            this.onGiveFilters()! as ProcessLogsFilterDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Process_Logs_' + new Date().toLocaleDateString()
              );
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.CARS:
      case GenerateTableKeys.CAR_ALL: {
        this._carsService
          .postExcelByUserNameAncCarsFilter(
            this.getUsername!,
            columns.join(', '),
            this.onGiveFilters()! as CarsFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Cars_' + new Date().toLocaleDateString()
              );
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.QUALITY_CHECKS: {
        this._qualityChecksService
          .postExcelByUserNameAndQualityChecksFilters(
            this.getUsername!,
            columns.join(', '),
            this.onGiveFilters()! as QualityChecksFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Quality_Checks_' + new Date().toLocaleDateString()
              );
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.ASSIGNED_PARTS: {
        this._carsPartsService
          .getExcelByUserNameAndCarsPartsFilters(
            this.getUsername!,
            columns.join(', '),
            this.onGiveFilters()! as CarsPartsFilterDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Cars_Parts' + new Date().toLocaleDateString()
              );
            },
          });
        break;
      }
      case GenerateTableKeys.MACHINE_USED: {
        this._processLogService
          .postExcelByUserNameAndMachineUsedFilters(
            this.getUsername!,
            columns.join(', '),
            this.onGiveFilters()! as MachineUsedFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Machine_Used' + new Date().toLocaleDateString()
              );
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.PART_PRODUCTION_BY_MACHINE: {
        this._partProductionService
          .excelDataByMachineNameOrIdAndPartProductionFilters(
            this.route.snapshot.paramMap.get('key')!,
            columns.join(', '),
            this.onGiveFilters()! as PartProductionFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Part_Production' + new Date().toLocaleDateString()
              );
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.MACHINE_PAGE: {
        this._processLogService
          .postExcelByMachineNameOrIdAndMachineFilters(
            this.route.snapshot.paramMap.get('key')!,
            columns.join(', '),
            this.onGiveFilters()! as MachineFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Machine_' + new Date().toLocaleDateString()
              );
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.USER_ALL: {
        this._userService
          .excelAllByUserAllFilters(
            columns.join(', '),
            this.onGiveFilters()! as UserAllFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Users_' + new Date().toLocaleDateString()
              );
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.MACHINE_ALL: {
        this._machineService
          .excelAllByMachineAllFilters(
            columns.join(', '),
            this.onGiveFilters()! as MachineAllFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Machine_' + new Date().toLocaleDateString()
              );
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.CARS_MODEL_ALL: {
        this._carModelService
          .excelCarModelByCarModelFilter(
            columns.join(', '),
            this.onGiveFilters()! as CarModelFilterDTO
          )
          .subscribe({
            next: (response) => {
              this._excelService.exportToExcel(
                tables,
                response,
                'Car_Models_' + new Date().toLocaleDateString()
              );
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      default: {
        console.error('not find onExport() ' + this.card.name);
        break;
      }
    }
  }

  onCardClick(card: Card) {
    const userName = this.getUsername!;
    const settings = this.cardSettings[card.name];
    if (!settings) {
      return;
    }
    this.card = card;
    this.onColumns();

    switch (card.name) {
      case GenerateTableKeys.PROCESS_LOG:
      case GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME: {
        this._processLogService
          .getDataByUserNameAndProcessLogIdAndProcessLogFilters(
            userName,
            this.getUsernameDifferentParams!,
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters()! as ProcessLogsFilterDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.CARS: {
        this._carsService
          .postDataByUserNameAndCarsFilters(
            userName,
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters()! as CarsFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.QUALITY_CHECKS: {
        this._qualityChecksService
          .postDataByUserNameAndQualityChecksFilters(
            userName,
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters()! as QualityChecksFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.ASSIGNED_PARTS: {
        this._carsPartsService
          .postDataByUserNameAndCarsPartsFilters(
            userName,
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters()! as CarsPartsFilterDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.MACHINE_USED: {
        this._processLogService
          .postDataByUsernameAndMachineUsedFilters(
            this.getUsername!,
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters()! as MachineUsedFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.PART_PRODUCTION_BY_MACHINE: {
        this._partProductionService
          .postDataByMachineNameOrIdAndPartProductionFilters(
            this.route.snapshot.paramMap.get('key')!,
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters()! as PartProductionFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.MACHINE_PAGE: {
        this._processLogService
          .postDataByMachineNameOrIdAndMachineFilters(
            this.route.snapshot.paramMap.get('key')!,
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters()! as MachineFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        break;
      }
      case GenerateTableKeys.USER_ALL: {
        this._userService
          .findAllByUserAllFilters(
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters() as UserAllFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        this.eventCard.emit(card);

        break;
      }
      case GenerateTableKeys.MACHINE_ALL: {
        this._machineService
          .findByMachineAllFilters(
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters() as MachineAllFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        this.eventCard.emit(card);
        break;
      }
      case GenerateTableKeys.CAR_ALL: {
        this._carsService
          .postDataByUserNameAndCarsFilters(
            null,
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters() as CarsFiltersDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        this.eventCard.emit(card);
        break;
      }
      case GenerateTableKeys.CARS_MODEL_ALL: {
        this._carModelService
          .postCarModelByCarModelFilter(
            settings.changePage,
            settings.sortPage,
            this.onGiveFilters() as CarModelFilterDTO
          )
          .subscribe({
            next: (response) => {
              this.data = [...response.items];
              this.count = response.count;
            },
            error: (error) => {
              console.error(error);
            },
          });
        this.eventCard.emit(card);
        break;
      }
      default: {
        console.error('not find onCardClick() ' + this.card.name);
        break;
      }
    }
  }

  onColumns(): TableColumn[] {
    if (
      !this.card ||
      !this.card.name ||
      !this.columnsSettings[this.card.name]
    ) {
      return [];
    }

    return this.columnsSettings[this.card.name];
  }

  onType(event: boolean) {
    this.type = event;
  }

  onForms() {
    return this.form[this.card.name];
  }

  onActivateFilters() {
    this.cardSettings[this.card.name].changePage.pageIndex = 0;
    this.onCardClick(this.card);
  }

  onGetPageIndex(): number {
    return this.cardSettings[this.card.name].changePage.pageIndex;
  }

  onDblClickRow(event: GenerateType) {
    switch (this.card.name) {
      case GenerateTableKeys.PROCESS_LOG: {
        if (isProcessLog(event)) {
          this._router.navigateByUrl('dashboard/process/' + event.id);
        }
        break;
      }
      case GenerateTableKeys.CARS: {
        if (isCars(event)) {
          this._router.navigateByUrl('dashboard/car/' + event.vin);
        }
        break;
      }
      case GenerateTableKeys.QUALITY_CHECKS: {
        if (isQualityCheck(event)) {
          this._router.navigateByUrl('dashboard/quality/' + event.id);
        }
        break;
      }
      case GenerateTableKeys.MACHINE_USED: {
        if (isProcessLog(event)) {
          this._router.navigateByUrl(
            'dashboard/machine/' + event.machine_id.name
          );
        }
        break;
      }
      case GenerateTableKeys.ASSIGNED_PARTS: {
        if (isCarsParts(event)) {
          this._router.navigateByUrl('dashboard/car/' + event.car_id.vin);
        }
        break;
      }
      case GenerateTableKeys.PART_PRODUCTION_BY_MACHINE: {
        if (isPartProduction(event)) {
          this._router.navigateByUrl(
            'dashboard/machine/' + event.machine_id.name
          );
        }
        break;
      }
      case GenerateTableKeys.MACHINE_PAGE: {
        if (isProcessLog(event)) {
          this._router.navigateByUrl(
            'dashboard/machine/' + event.machine_id.name
          );
        }
        break;
      }
      case GenerateTableKeys.USER_ALL:
      case GenerateTableKeys.MACHINE_ALL:
      case GenerateTableKeys.CAR_ALL:
      case GenerateTableKeys.CARS_MODEL_ALL: {
        this.eventRow.emit(event);
        break;
      }
      default: {
        console.error('not found onDblClickRow()' + this.card.name);
      }
    }
  }

  private onGiveFilters():
    | ProcessLogsFilterDTO
    | CarsFiltersDTO
    | QualityChecksFiltersDTO
    | CarsPartsFilterDTO
    | MachineUsedFiltersDTO
    | PartProductionFiltersDTO
    | MachineFiltersDTO
    | UserAllFiltersDTO
    | MachineAllFiltersDTO
    | CarModelFilterDTO
    | null {
    switch (this.card.name) {
      case GenerateTableKeys.PROCESS_LOG:
        return {
          status:
            this.form[GenerateTableKeys.PROCESS_LOG].value.status === '' ||
            this.form[GenerateTableKeys.PROCESS_LOG].value.status === 'NONE'
              ? null
              : this.form[GenerateTableKeys.PROCESS_LOG].value.status,
          process_id_name:
            this.form[GenerateTableKeys.PROCESS_LOG].value.process_id_name ===
            ''
              ? null
              : this.form[GenerateTableKeys.PROCESS_LOG].value.process_id_name,
          machine_id_name:
            this.form[GenerateTableKeys.PROCESS_LOG].value.machine_id_name ===
            ''
              ? null
              : this.form[GenerateTableKeys.PROCESS_LOG].value.machine_id_name,
          start_date:
            this.form[GenerateTableKeys.PROCESS_LOG].value.start_time === ''
              ? null
              : this.form[GenerateTableKeys.PROCESS_LOG].value.start_time,
          end_date:
            this.form[GenerateTableKeys.PROCESS_LOG].value.end_time === ''
              ? null
              : this.form[GenerateTableKeys.PROCESS_LOG].value.end_time,
        };
      case GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME: {
        //the same like PROCESS_LOG
        return {
          status:
            this.form[
              GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
            ].value.status === '' ||
            this.form[
              GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
            ].value.status === 'NONE'
              ? null
              : this.form[
                  GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
                ].value.status,
          process_id_name:
            this.form[
              GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
            ].value.process_id_name === ''
              ? null
              : this.form[
                  GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
                ].value.process_id_name,
          machine_id_name:
            this.form[
              GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
            ].value.machine_id_name === ''
              ? null
              : this.form[
                  GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
                ].value.machine_id_name,
          start_date:
            this.form[
              GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
            ].value.start_time === ''
              ? null
              : this.form[
                  GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
                ].value.start_time,
          end_date:
            this.form[
              GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
            ].value.end_time === ''
              ? null
              : this.form[
                  GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME
                ].value.end_time,
        };
      }
      case GenerateTableKeys.CARS: {
        return {
          model_id_release_year:
            this.form[GenerateTableKeys.CARS].value.model_id_release_year === ''
              ? null
              : this.form[GenerateTableKeys.CARS].value.model_id_release_year,
          status:
            this.form[GenerateTableKeys.CARS].value.status === '' ||
            this.form[GenerateTableKeys.CARS].value.status === 'NONE'
              ? null
              : this.form[GenerateTableKeys.CARS].value.status,
          vin:
            this.form[GenerateTableKeys.CARS].value.vin === ''
              ? null
              : this.form[GenerateTableKeys.CARS].value.vin,
          model_id_generation:
            this.form[GenerateTableKeys.CARS].value.model_id_generation === ''
              ? null
              : this.form[GenerateTableKeys.CARS].value.model_id_generation,
          model_id_name:
            this.form[GenerateTableKeys.CARS].value.model_id_name === ''
              ? null
              : this.form[GenerateTableKeys.CARS].value.model_id_name,
        };
      }
      case GenerateTableKeys.QUALITY_CHECKS: {
        return {
          car_id_model_id_name:
            this.form[GenerateTableKeys.QUALITY_CHECKS].value
              .car_id_model_id_name === ''
              ? null
              : this.form[GenerateTableKeys.QUALITY_CHECKS].value
                  .car_id_model_id_name,
          car_id_model_id_generation:
            this.form[GenerateTableKeys.QUALITY_CHECKS].value
              .car_id_model_id_generation === ''
              ? null
              : this.form[GenerateTableKeys.QUALITY_CHECKS].value
                  .car_id_model_id_generation,
          car_id_model_id_release_year:
            this.form[GenerateTableKeys.QUALITY_CHECKS].value
              .car_id_model_id_release_year === ''
              ? null
              : this.form[GenerateTableKeys.QUALITY_CHECKS].value
                  .car_id_model_id_release_year,
          inspector_id_name:
            this.form[GenerateTableKeys.QUALITY_CHECKS].value
              .inspector_id_name === ''
              ? null
              : this.form[GenerateTableKeys.QUALITY_CHECKS].value
                  .inspector_id_name,
          check_date:
            this.form[GenerateTableKeys.QUALITY_CHECKS].value.check_date === ''
              ? null
              : this.form[GenerateTableKeys.QUALITY_CHECKS].value.check_date,
          passed:
            this.form[GenerateTableKeys.QUALITY_CHECKS].value.passed === '' ||
            this.form[GenerateTableKeys.QUALITY_CHECKS].value.passed === 'NONE'
              ? null
              : this.form[GenerateTableKeys.QUALITY_CHECKS].value.passed,
          car_id_status:
            this.form[GenerateTableKeys.QUALITY_CHECKS].value.car_id_status ===
              '' ||
            this.form[GenerateTableKeys.QUALITY_CHECKS].value.car_id_status ===
              'NONE'
              ? null
              : this.form[GenerateTableKeys.QUALITY_CHECKS].value.car_id_status,
        };
      }
      case GenerateTableKeys.ASSIGNED_PARTS: {
        return {
          part_id_unit_cost:
            this.form[GenerateTableKeys.ASSIGNED_PARTS].value
              .part_id_unit_cost === ''
              ? null
              : this.form[GenerateTableKeys.ASSIGNED_PARTS].value
                  .part_id_unit_cost,
          quantity:
            this.form[GenerateTableKeys.ASSIGNED_PARTS].value.quantity === ''
              ? null
              : this.form[GenerateTableKeys.ASSIGNED_PARTS].value.quantity,
          installed_by_name:
            this.form[GenerateTableKeys.ASSIGNED_PARTS].value
              .installed_by_name === ''
              ? null
              : this.form[GenerateTableKeys.ASSIGNED_PARTS].value
                  .installed_by_name,
          part_id_category:
            this.form[GenerateTableKeys.ASSIGNED_PARTS].value
              .part_id_category === '' ||
            this.form[GenerateTableKeys.ASSIGNED_PARTS].value
              .part_id_category === 'NONE'
              ? null
              : this.form[GenerateTableKeys.ASSIGNED_PARTS].value
                  .part_id_category,
          part_id_name:
            this.form[GenerateTableKeys.ASSIGNED_PARTS].value.part_id_name ===
            ''
              ? null
              : this.form[GenerateTableKeys.ASSIGNED_PARTS].value.part_id_name,
          car_id_model_id_name:
            this.form[GenerateTableKeys.ASSIGNED_PARTS].value
              .car_id_model_id_name === ''
              ? null
              : this.form[GenerateTableKeys.ASSIGNED_PARTS].value
                  .car_id_model_id_name,
        };
      }
      case GenerateTableKeys.MACHINE_USED: {
        return {
          machine_id_name:
            this.form[GenerateTableKeys.MACHINE_USED].value.machine_id_name ===
            ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_USED].value.machine_id_name,
          machine_id_status:
            this.form[GenerateTableKeys.MACHINE_USED].value
              .machine_id_status === '' ||
            this.form[GenerateTableKeys.MACHINE_USED].value
              .machine_id_status === 'NONE'
              ? null
              : this.form[GenerateTableKeys.MACHINE_USED].value
                  .machine_id_status,
          car_id_model_id_name:
            this.form[GenerateTableKeys.MACHINE_USED].value
              .car_id_model_id_name === ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_USED].value
                  .car_id_model_id_name,
          status:
            this.form[GenerateTableKeys.MACHINE_USED].value.status === '' ||
            this.form[GenerateTableKeys.MACHINE_USED].value.status === 'NONE'
              ? null
              : this.form[GenerateTableKeys.MACHINE_USED].value.status,
          process_id_name:
            this.form[GenerateTableKeys.MACHINE_USED].value.process_id_name ===
            ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_USED].value.process_id_name,
          employee_id_user_id_username:
            this.form[GenerateTableKeys.MACHINE_USED].value
              .employee_id_user_id_username === ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_USED].value
                  .employee_id_user_id_username,
        };
      }
      case GenerateTableKeys.PART_PRODUCTION_BY_MACHINE: {
        return {
          part_id_name:
            this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
              .part_id_name === ''
              ? null
              : this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
                  .part_id_name,
          part_id_category:
            this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
              .part_id_category === '' ||
            this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
              .part_id_category === 'NONE'
              ? null
              : this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
                  .part_id_category,
          produced_date:
            this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
              .produced_date === ''
              ? null
              : this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
                  .produced_date,
          quantity:
            this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
              .quantity === ''
              ? null
              : this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
                  .quantity,
          part_id_unit_cost:
            this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
              .part_id_unit_cost === ''
              ? null
              : this.form[GenerateTableKeys.PART_PRODUCTION_BY_MACHINE].value
                  .part_id_unit_cost,
        };
      }
      case GenerateTableKeys.MACHINE_PAGE: {
        return {
          employee_id_user_id_username:
            this.form[GenerateTableKeys.MACHINE_PAGE].value
              .employee_id_user_id_username === ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_PAGE].value
                  .employee_id_user_id_username,
          employee_id_user_id_role:
            this.form[GenerateTableKeys.MACHINE_PAGE].value
              .employee_id_user_id_role === '' ||
            this.form[GenerateTableKeys.MACHINE_PAGE].value
              .employee_id_user_id_role === 'NONE'
              ? null
              : this.form[GenerateTableKeys.MACHINE_PAGE].value
                  .employee_id_user_id_role,
          process_id_name:
            this.form[GenerateTableKeys.MACHINE_PAGE].value.process_id_name ===
            ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_PAGE].value.process_id_name,
          employee_id_department:
            this.form[GenerateTableKeys.MACHINE_PAGE].value
              .employee_id_department === ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_PAGE].value
                  .employee_id_department,
          start_time:
            this.form[GenerateTableKeys.MACHINE_PAGE].value.start_time === ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_PAGE].value.start_time,
          end_time:
            this.form[GenerateTableKeys.MACHINE_PAGE].value.end_time === ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_PAGE].value.end_time,
          status:
            this.form[GenerateTableKeys.MACHINE_PAGE].value.status === '' ||
            this.form[GenerateTableKeys.MACHINE_PAGE].value.status === 'NONE'
              ? null
              : this.form[GenerateTableKeys.MACHINE_PAGE].value.status,
        };
      }
      case GenerateTableKeys.USER_ALL: {
        return {
          username:
            this.form[GenerateTableKeys.USER_ALL].value.username === ''
              ? null
              : this.form[GenerateTableKeys.USER_ALL].value.username,
          email:
            this.form[GenerateTableKeys.USER_ALL].value.email === ''
              ? null
              : this.form[GenerateTableKeys.USER_ALL].value.email,
          role:
            this.form[GenerateTableKeys.USER_ALL].value.role === '' ||
            this.form[GenerateTableKeys.USER_ALL].value.role === 'NONE'
              ? null
              : this.form[GenerateTableKeys.USER_ALL].value.role,
          employees_id_name:
            this.form[GenerateTableKeys.USER_ALL].value.employees_id_name === ''
              ? null
              : this.form[GenerateTableKeys.USER_ALL].value.employees_id_name,
        };
      }
      case GenerateTableKeys.MACHINE_ALL: {
        return {
          last_maintenance:
            this.form[GenerateTableKeys.MACHINE_ALL].value.last_maintenance ===
            ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_ALL].value.last_maintenance,
          status:
            this.form[GenerateTableKeys.MACHINE_ALL].value.status === '' ||
            this.form[GenerateTableKeys.MACHINE_ALL].value.status === 'NONE'
              ? null
              : this.form[GenerateTableKeys.MACHINE_ALL].value.status,
          type:
            this.form[GenerateTableKeys.MACHINE_ALL].value.type === ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_ALL].value.type,
          name:
            this.form[GenerateTableKeys.MACHINE_ALL].value.name === ''
              ? null
              : this.form[GenerateTableKeys.MACHINE_ALL].value.name,
        };
      }
      case GenerateTableKeys.CAR_ALL: {
        //the same like PROCESS_LOG
        return {
          model_id_release_year:
            this.form[GenerateTableKeys.CAR_ALL].value.model_id_release_year ===
            ''
              ? null
              : this.form[GenerateTableKeys.CAR_ALL].value
                  .model_id_release_year,
          status:
            this.form[GenerateTableKeys.CAR_ALL].value.status === '' ||
            this.form[GenerateTableKeys.CAR_ALL].value.status === 'NONE'
              ? null
              : this.form[GenerateTableKeys.CAR_ALL].value.status,
          vin:
            this.form[GenerateTableKeys.CAR_ALL].value.vin === ''
              ? null
              : this.form[GenerateTableKeys.CAR_ALL].value.vin,
          model_id_generation:
            this.form[GenerateTableKeys.CAR_ALL].value.model_id_generation ===
            ''
              ? null
              : this.form[GenerateTableKeys.CAR_ALL].value.model_id_generation,
          model_id_name:
            this.form[GenerateTableKeys.CAR_ALL].value.model_id_name === ''
              ? null
              : this.form[GenerateTableKeys.CAR_ALL].value.model_id_name,
        };
      }
      case GenerateTableKeys.CARS_MODEL_ALL: {
        return {
          name:
            this.form[GenerateTableKeys.CARS_MODEL_ALL].value.name === ''
              ? null
              : this.form[GenerateTableKeys.CARS_MODEL_ALL].value.name,
          generation:
            this.form[GenerateTableKeys.CARS_MODEL_ALL].value.generation === ''
              ? null
              : this.form[GenerateTableKeys.CARS_MODEL_ALL].value.generation,
          release_year:
            this.form[GenerateTableKeys.CARS_MODEL_ALL].value.release_year ===
            ''
              ? null
              : this.form[GenerateTableKeys.CARS_MODEL_ALL].value.release_year,
        };
      }
      default: {
        console.error('not found onGiveFilters(): ', this.card.name);
      }
    }
    return null;
  }

  private onDefaultForms() {
    this.form = {
      [GenerateTableKeys.PROCESS_LOG]: this._fb.group({
        status: ['NONE'],
        process_id_name: [null],
        machine_id_name: [null],
        start_time: [null],
        end_time: [null],
      }),
      [GenerateTableKeys.CARS]: this._fb.group({
        model_id_release_year: [null],
        status: ['NONE'],
        vin: [null],
        model_id_generation: [null],
        model_id_name: [null],
      }),
      [GenerateTableKeys.QUALITY_CHECKS]: this._fb.group({
        car_id_model_id_name: [null],
        car_id_model_id_generation: [null],
        car_id_model_id_release_year: [null],
        inspector_id_name: [null],
        check_date: [null],
        passed: ['NONE'],
        car_id_status: ['NONE'],
      }),
      [GenerateTableKeys.ASSIGNED_PARTS]: this._fb.group({
        part_id_unit_cost: [null],
        quantity: [null],
        installed_by_name: [null],
        part_id_category: ['NONE'],
        part_id_name: [null],
        car_id_model_id_name: [null],
      }),
      [GenerateTableKeys.MACHINE_USED]: this._fb.group({
        machine_id_name: [null],
        machine_id_status: ['NONE'],
        car_id_model_id_name: [null],
        status: ['NONE'],
        process_id_name: [null],
        employee_id_user_id_username: [null],
      }),
      [GenerateTableKeys.PART_PRODUCTION_BY_MACHINE]: this._fb.group({
        part_id_name: [null],
        part_id_category: ['NONE'],
        produced_date: [null],
        quantity: [null],
        part_id_unit_cost: [null],
      }),
      [GenerateTableKeys.MACHINE_PAGE]: this._fb.group({
        employee_id_user_id_username: [null],
        employee_id_user_id_role: ['NONE'],
        process_id_name: [null],
        employee_id_department: [null],
        start_time: [null],
        end_time: [null],
        status: ['NONE'],
      }),
      [GenerateTableKeys.USER_ALL]: this._fb.group({
        username: [null],
        email: [null],
        role: ['NONE'],
        employees_id_name: [null],
      }),
      [GenerateTableKeys.MACHINE_ALL]: this._fb.group({
        last_maintenance: [null],
        status: ['NONE'],
        type: [null],
        name: [null],
      }),
      [GenerateTableKeys.CAR_ALL]: this._fb.group({
        //the same like [GenerateTableKeys.CARS]
        model_id_release_year: [null],
        status: ['NONE'],
        vin: [null],
        model_id_generation: [null],
        model_id_name: [null],
      }),
      [GenerateTableKeys.PROCESS_LOG_BY_PROCESS_NAME_AND_USERNAME]:
        //the same like [GenerateTableKeys.PROCESS_LOG]
        this._fb.group({
          status: ['NONE'],
          process_id_name: [null],
          machine_id_name: [null],
          start_time: [null],
          end_time: [null],
        }),
      [GenerateTableKeys.CARS_MODEL_ALL]: this._fb.group({
        name: [null],
        generation: [null],
        release_year: [null],
      }),
    };
  }

  visibleCards(): Card[] {
    return Object.values(this.cards).filter((card) =>
      this.keys.includes(card.name as GenerateTableKeys)
    );
  }

  private get getUsername(): string | null {
    if (!window.location.pathname.split('/').includes('create')) {
      const parts = window.location.pathname.split('/');
      const userIndex = parts.indexOf('user');

      if (userIndex !== -1 && parts.length > userIndex + 1) {
        return parts[userIndex + 1];
      }

      return this._JwtService.getUserInfo()?.name!;
    }
    return null;
  }

  private get getUsernameDifferentParams(): string | null {
    const key = this.route.snapshot.paramMap.get('key');
    const username = this.getUsername;

    return key !== null && username !== key ? key : null;
  }
}
