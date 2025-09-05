import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { ChartData, ChartOptions } from 'chart.js';
import { JwtService } from '../../_service/_http/jwt.service';
import { isProcessLog, ProcessLog } from '../../_model/_interface/process-log';
import { MachineService } from '../../_service/_model/machine.service';
import { ChartsComponent } from '../../_components/charts/charts.component';
import { Cars, isCars } from '../../_model/_interface/car';
import { CarsService } from '../../_service/_model/cars.service';
import { response } from 'express';
import { error } from 'console';
import { ViewType } from '../view-type';
import { CHART_COLORS } from '../chard-colors';
import { isMachine, Machines } from '../../_model/_interface/machine';
import { ViewData } from '../view-data';
import { CountViewDTO } from '../../_model/_dto/count-view-dto';

@Component({
  selector: 'app-view-chart',
  standalone: true,
  imports: [ChartsComponent, HttpClientModule, MatDialogContent, CommonModule],
  providers: [JwtService, MachineService, CarsService],
  templateUrl: './view-chart.component.html',
  styleUrl: './view-chart.component.scss',
})
export class ViewChartComponent {
  hasValue = false;

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      tooltip: { enabled: true },
    },
  };

  constructor(
    private _machineService: MachineService,
    private _carsService: CarsService,
    @Inject(MAT_DIALOG_DATA)
    protected data: {
      data: ViewData;
      type: ViewType;
      title: string;
    }
  ) {}

  ngAfterViewInit(): void {
    if (
      isProcessLog(this.data.data) &&
      this.data.type === ViewType.PROCESS_LOG
    ) {
      this._machineService
        .countStatusByMachineId(this.data.data.machine_id.id!)
        .subscribe({
          next: (response) => {
            this.generateChartPie(response, CHART_COLORS.STATUS_BY_MACHINE_ID);
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else if (isCars(this.data.data) && this.data.type === ViewType.CARS) {
      this._carsService
        .countStatusByCarModelId(this.data.data.model_id.id)
        .subscribe({
          next: (response) => {
            this.generateChartPie(
              response,
              CHART_COLORS.STATUS_BY_CAR_MODEL_ID
            );
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else if (
      isMachine(this.data.data) &&
      this.data.type === ViewType.MACHINES
    ) {
      this._machineService
        .countStatusByMachineId(this.data.data!.id!)
        .subscribe({
          next: (response) => {
            this.generateChartPie(response, CHART_COLORS.STATUS_BY_MACHINE_ID);
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      console.error(
        'not found ViewChartComponent + ngAfterViewInit()' + this.data.type
      );
    }
  }

  private generateChartPie(response: CountViewDTO, chartColor: string[]) {
    Object.entries(response).forEach(([key, value]) => {
      if (value !== 0) {
        this.hasValue = true;
      }
    });
    const data = Object.values(response);

    this.pieChartData.labels = data.map((l) => l.status + ' ' + l.count);
    this.pieChartData.datasets[0].data = data.map((d) => d.count) as number[];

    this.pieChartData.datasets[0].backgroundColor = chartColor;
    this.pieChartData.datasets[0].borderColor = chartColor;
  }
}
