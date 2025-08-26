import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InformationLeftRight } from './information-left-right';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { ICONS } from '../../_shared/icons';
import { DialogService } from '../../_service/_dialog/dialog.service';
import { ViewType } from '../../_dialog/view-type';
import { isMachine, Machines } from '../../_model/_interface/machine';
import { InputComponent } from '../input/input.component';
import { GenInput } from '../input/input';
import { FormGroup } from '@angular/forms';
import { isProcessLog, ProcessLog } from '../../_model/_interface/process-log';
import { isCars } from '../../_model/_interface/car';
import { ViewData } from '../../_dialog/view-data';

@Component({
  selector: 'app-com-information',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    InputComponent,
  ],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss',
})
export class InformationComponent {
  @Input() information!: InformationLeftRight;
  @Input() data!: ViewData;
  @Input() config!: GenInput;
  @Input() form!: FormGroup;
  @Output() selectChange = new EventEmitter<any>();

  type!: ViewType;
  title!: string;
  chars: Char[] = [
    {
      name: 'Pie',
      icon: ICONS.PIE,
    },
    {
      name: 'Line',
      icon: ICONS.LINE,
    },
    { name: 'Polar', icon: ICONS.POLAR },
  ];

  constructor(private _dialogService: DialogService) {
    if (isMachine(this.data)) {
      this.type = ViewType.MACHINES;
      this.title = 'Status by Machine';
    }
    if (isProcessLog(this.data)) {
      this.type = ViewType.PROCESS_LOG;
      this.title = 'Status by Process';
    }
    if (isCars(this.data)) {
      this.type = ViewType.CARS;
      this.title = 'Status by Cars';
    }
  }

  onSelectChange(event: any) {
    this.selectChange.emit(event);
  }

  onSelectChart(event: MatButtonToggleChange) {
    switch (event.value) {
      case this.chars[0].name: {
        this._dialogService
          .openDialogViewChart(this.data, this.type, this.title)
          .subscribe((result) => {
            this.selectChange.emit(null);
          });
        break;
      }
      case this.chars[1].name: {
        this._dialogService
          .openDialogViewLine(this.data, this.type, this.title)
          .subscribe((result) => {
            this.selectChange.emit(null);
          });
        break;
      }
      case this.chars[2].name: {
        this._dialogService
          .openDialogViewPolar(this.data, this.type, this.title)
          .subscribe((result) => {
            this.selectChange.emit(null);
          });
        break;
      }
      default: {
        console.log('NOT FIND ANY CHART');
      }
    }
  }
}
interface Char {
  name: string;
  icon: string;
}
