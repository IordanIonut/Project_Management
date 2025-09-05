import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../_service/_alert/alert.service';
import { ProcessLogService } from '../../_service/_model/process-log.service';
import { CarsService } from '../../_service/_model/cars.service';
import { MachineService } from '../../_service/_model/machine.service';
import { DeleteType } from './delete-type';
import { JwtService } from '../../_service/_http/jwt.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../_components/input/input.component';
import { GenInput } from '../../_components/input/input';
import { AlertEnum } from '../../_model/_common/alert';
import { GenerateType } from '../../_components/generate-table/generate-type';
import { isUser } from '../../_model/_interface/user';
import { UserService } from '../../_service/_model/user.service';
import { isMachine } from '../../_model/_interface/machine';
import { isCars } from '../../_model/_interface/car';
import { isCarModel } from '../../_model/_interface/car-model';
import { CarsModelService } from '../../_service/_model/car-model.service';

@Component({
  selector: 'app-validate-delete',
  standalone: true,
  imports: [HttpClientModule, MatDialogContent, MatIconModule, InputComponent],
  providers: [
    MachineService,
    CarsService,
    ProcessLogService,
    UserService,
    CarsModelService,
  ],
  templateUrl: './validate-delete.component.html',
  styleUrl: './validate-delete.component.scss',
})
export class ValidateDeleteComponent {
  message!: string;
  code!: string;
  form!: FormGroup;
  config: GenInput = {
    formControlName: 'code',
    placeholder: 'Code',
    type: 'text',
    label: 'Code',
    icon: 'code',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      selected: GenerateType;
      type: DeleteType;
    },
    private dialogRef: MatDialogRef<ValidateDeleteComponent>,
    private _jwtService: JwtService,
    private _alertService: AlertService,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _machineService: MachineService,
    private _carService: CarsService,
    private _carModelService: CarsModelService
  ) {
    this.form = this._fb.group({
      code: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.message = `You are sore want to delete this `;
    switch (this.data.type) {
      case DeleteType.User: {
        if (isUser(this.data.selected)) {
          this.code =
            this._jwtService.getUserInfo()?.name + '/' + this.data.selected.id;
          this.message += `user -> ${this.data.selected.username}. <br>For can delete need to write '${this.code}'.`;
        }
        break;
      }
      case DeleteType.Machine: {
        if (isMachine(this.data.selected)) {
          this.code =
            this._jwtService.getUserInfo()?.name + '/' + this.data.selected.id;
          this.message += `machine -> ${this.data.selected.name}. <br>For can delete need to write '${this.code}'.`;
        }
        break;
      }
      case DeleteType.Car: {
        if (isCars(this.data.selected)) {
          this.code =
            this._jwtService.getUserInfo()?.name + '/' + this.data.selected.id;
          this.message += `car -> ${this.data.selected.vin}. <br>For can delete need to write '${this.code}'.`;
        }
        break;
      }
      case DeleteType.CarModel: {
        if (isCarModel(this.data.selected)) {
          this.code =
            this._jwtService.getUserInfo()?.name + '/' + this.data.selected.id;
          this.message += `car model -> ${this.data.selected.name}. <br>For can delete need to write '${this.code}'.`;
        }
        break;
      }
      default: {
        console.error(
          'not found ngAfterViewInit() in ValidateDeleteComponent: ' +
            DeleteType[this.data.type]
        );
      }
    }
  }

  onSave() {
    this.form.markAllAsTouched();
    if (
      this.form.get('code')?.hasError('required') &&
      this.form.get('code')?.touched
    ) {
      this._alertService.show('Code is required.', AlertEnum.ERROR);
    }
    if (this.form.valid) {
      if (this.form.get('code')?.value !== this.code) {
        this._alertService.show('Code is not correctly.', AlertEnum.ERROR);
        return;
      }
      switch (this.data.type) {
        case DeleteType.User: {
          this._userService.deleteById(this.data.selected.id!).subscribe({
            next: (response) => {
              this._alertService.show(
                'User was delete successfully.',
                AlertEnum.SUCCESS
              );
              this.onClose(true);
            },
            error: (error) => {
              console.error(error);
              this._alertService.show(
                'This user is connected with another instance.',
                AlertEnum.ERROR
              );
            },
          });
          break;
        }
        case DeleteType.Machine: {
          this._machineService.deleteById(this.data.selected.id!).subscribe({
            next: (response) => {
              this._alertService.show(
                'Machine was delete successfully.',
                AlertEnum.SUCCESS
              );
              this.onClose(true);
            },
            error: (error) => {
              console.error(error);
              this._alertService.show(
                'This machine is connected with another instance.',
                AlertEnum.ERROR
              );
            },
          });
          break;
        }
        case DeleteType.Car: {
          this._carService.delete(this.data.selected.id!).subscribe({
            next: (response) => {
              this._alertService.show(
                'Car was delete successfully.',
                AlertEnum.SUCCESS
              );
              this.onClose(true);
            },
            error: (error) => {
              console.error(error);
              this._alertService.show(
                'This car is connected with another instance.',
                AlertEnum.ERROR
              );
            },
          });
          break;
        }
        case DeleteType.CarModel: {
          this._carModelService.delete(this.data.selected.id!).subscribe({
            next: (response) => {
              this._alertService.show(
                'Car Model was delete successfully.',
                AlertEnum.SUCCESS
              );
              this.onClose(true);
            },
            error: (error) => {
              console.error(error);
              this._alertService.show(
                'This car model is connected with another instance.',
                AlertEnum.ERROR
              );
            },
          });
          break;
        }
        default: {
          'not found onSave() in ValidateDeleteComponent: ' +
            DeleteType[this.data.type];
        }
      }
    }
  }

  onClose(result: boolean) {
    this.dialogRef.close(result);
  }
}
