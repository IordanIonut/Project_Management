import { Component, Inject } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MachineService } from '../../_service/_model/machine.service';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { isCars } from '../../_model/_interface/car';
import { isProcessLog } from '../../_model/_interface/process-log';
import { ChartsComponent } from '../../_components/charts/charts.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CHART_COLORS } from '../chard-colors';
import { ViewType } from '../view-type';
import { isMachine } from '../../_model/_interface/machine';
import { CountViewDTO } from '../../_model/_dto/count-view-dto';
import { CarsService } from '../../_service/_model/cars.service';
import { ViewData } from '../view-data';

@Component({
  selector: 'app-view-polar',
  standalone: true,
  imports: [ChartsComponent, HttpClientModule, MatDialogContent, CommonModule],
  providers: [MachineService, CarsService],
  templateUrl: './view-polar.component.html',
  styleUrl: './view-polar.component.scss',
})
export class ViewPolarComponent {
  hasValue = false;

  pieChartData: ChartData<'polarArea'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  pieChartOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        enabled: true,
      },
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
        .countStatusByMachineId(this.data.data.machine_id!.id!)
        .subscribe({
          next: (response) => {
            this.generateChartPolar(
              response,
              CHART_COLORS.STATUS_BY_MACHINE_ID
            );
          },
          error: (error) => {
            console.error('Line chart data error:', error);
          },
        });
    } else if (
      isMachine(this.data.data) &&
      this.data.type === ViewType.MACHINES
    ) {
      this._machineService
        .countStatusByMachineId(this.data.data.id!)
        .subscribe({
          next: (response) => {
            this.generateChartPolar(
              response,
              CHART_COLORS.STATUS_BY_MACHINE_ID
            );
          },
          error: (error) => {
            console.error('Line chart data error:', error);
          },
        });
    } else if (isCars(this.data.data) && this.data.type === ViewType.CARS) {
      this._carsService
        .countStatusByCarModelId(this.data.data.model_id.id)
        .subscribe({
          next: (response) => {
            this.generateChartPolar(
              response,
              CHART_COLORS.STATUS_BY_CAR_MODEL_ID
            );
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      console.error(
        'not found ViewPolarComponent + ngAfterViewInit()' + this.data.type
      );
    }
  }

  private generateChartPolar(response: CountViewDTO, chartColor: string[]) {
    Object.entries(response).forEach(([key, value]) => {
      if (value !== 0) {
        this.hasValue = true;
      }
    });
    const data = Object.values(response);

    this.pieChartData.labels = data.map((d) => d.status);
    this.pieChartData.datasets[0].data = data.map((d) => d.count);
    this.pieChartData.datasets[0].backgroundColor = chartColor;
    this.pieChartData.datasets[0].borderColor = chartColor;
  }
}
