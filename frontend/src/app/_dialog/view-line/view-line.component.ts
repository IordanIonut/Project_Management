import { Component, Inject } from '@angular/core';
import { MachineService } from '../../_service/_model/machine.service';
import { ChartData, ChartOptions } from 'chart.js';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { isProcessLog, ProcessLog } from '../../_model/_interface/process-log';
import { Cars, isCars } from '../../_model/_interface/car';
import { ChartsComponent } from '../../_components/charts/charts.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ViewType } from '../view-type';
import { ViewData } from '../view-data';
import { isMachine } from '../../_model/_interface/machine';
import { CountViewDTO } from '../../_model/_dto/count-view-dto';
import { throws } from 'assert';
import { CarsService } from '../../_service/_model/cars.service';

@Component({
  selector: 'app-view-line',
  standalone: true,
  imports: [ChartsComponent, HttpClientModule, MatDialogContent, CommonModule],
  providers: [MachineService, CarsService],
  templateUrl: './view-line.component.html',
  styleUrl: './view-line.component.scss',
})
export class ViewLineComponent {
  hasValue = false;

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: '#42A5F5',
        label: '',
        backgroundColor: 'rgba(66,165,245,0.3)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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
            this.generateChartLine(response);
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
        .countStatusByMachineId(this.data.data!.id!)
        .subscribe({
          next: (response) => {
            this.generateChartLine(response);
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
            this.generateChartLine(response);
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      console.error(
        'not found ViewLineComponent + ngAfterViewInit()' + this.data.type
      );
    }
  }

  private generateChartLine(response: CountViewDTO) {
    Object.entries(response).forEach(([key, value]) => {
      if (value !== 0) {
        this.hasValue = true;
      }
    });
    const data = Object.values(response);

    this.lineChartData.labels = data.map((d) => d.status);
    this.lineChartData.datasets[0].data = data.map((d) => d.count);
  }
}
