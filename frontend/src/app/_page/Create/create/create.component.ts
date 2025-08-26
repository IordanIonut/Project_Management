import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NamePageComponent } from '../../../_components/name-page/name-page.component';
import { NamePage } from '../../../_components/name-page/name-page';
import { ICONS } from '../../../_shared/icons';
import { Card } from '../../../_model/_common/card';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../_components/card/card.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../_model/_interface/user';
import { Machines } from '../../../_model/_interface/machine';
import { GenInput } from '../../../_components/input/input';
import { InputComponent } from '../../../_components/input/input.component';
import { HttpClientModule } from '@angular/common/http';
import { UserRole } from '../../../_model/_enum/user-role';
import { EmployeeRole } from '../../../_model/_enum/employee-role';
import { MachineStatus } from '../../../_model/_enum/machine-status';
import { AlertService } from '../../../_service/_alert/alert.service';
import { UserService } from '../../../_service/_model/user.service';
import { MachineService } from '../../../_service/_model/machine.service';
import { AlertEnum } from '../../../_model/_common/alert';
import { firstValueFrom } from 'rxjs';
import { GenerateTableKeys } from '../../../_components/generate-table/generate-table-key';
import { GenerateTableComponent } from '../../../_components/generate-table/generate-table.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    MatCardModule,
    NamePageComponent,
    CardComponent,
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    HttpClientModule,
    GenerateTableComponent,
  ],
  providers: [UserService, MachineService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  page: NamePage = {
    name: 'Create New ',
    icon: ICONS.ADD,
  };
  cards: Card[] = [
    {
      name: 'User',
      icon: ICONS.EMPLOYEE,
      color: 'blue',
    },
    {
      name: 'Machine',
      icon: ICONS.MACHINE,
      color: 'red',
    },
  ];
  configs: GenInput[] = [];

  type: boolean = true;
  cardSelected!: Card;
  form!: FormGroup;

  keys!: GenerateTableKeys[];
  isHiddenInformation: boolean = false;
  isBackHidden: boolean = false;
  typeMode!: 'edit' | 'add' | 'delete';

  constructor(
    private _fb: FormBuilder,
    private _alertService: AlertService,
    private _userService: UserService,
    private _machineService: MachineService
  ) {
    this.typeMode = 'edit';
    this.onCardClick(this.cards[0]);
  }

  onType(event: boolean) {
    this.type = event;
  }

  onEdit() {
    this.page = {
      name: 'Edit Instance',
      icon: ICONS.EDIT,
      content: [],
    };
    this.typeMode = 'edit';
  }

  onDelete() {
    this.page = {
      name: 'Delete Instance',
      icon: ICONS.REMOVE,
      content: [],
    };
    this.typeMode = 'delete';
  }

  onAdd() {
    this.page = {
      name: 'Add Instance',
      icon: ICONS.ADD,
      content: [],
    };
    this.typeMode = 'add';
    this.onCardClick(this.cards[0]);
  }

  onBack() {
    this.isBackHidden = !this.isBackHidden;
    this.onCardClick(this.cardSelected);
  }

  onCardClick(card: Card) {
    this.cardSelected = card;
    this.page.content = [card.name];
    if (this.typeMode === 'add' || this.typeMode === 'edit') {
      this.isBackHidden = false;
      this.keys = [GenerateTableKeys.USER_ALL, GenerateTableKeys.MACHINE_ALL];
    } else {
      this.isBackHidden = true;
      this.keys = [];
    }

    switch (this.typeMode) {
      case 'add': {
        this.addEvent(card);
        break;
      }
      default: {
        console.error('not find onCardClick(): ' + this.typeMode);
      }
    }
  }

  onEventRowSelected(event: any) {
    console.log(event);
    this.isBackHidden = true;
  }

  setHiddenTable() {
    this.isBackHidden = !this.isBackHidden;
  }

  get shouldHideTable(): boolean {
    return (
      (this.typeMode !== 'edit' && this.typeMode !== 'delete') ||
      this.isBackHidden
    );
  }

  async onSaveNewInstance() {
    this.form.markAllAsTouched();

    switch (this.cardSelected.name) {
      case ENUM.User: {
        try {
          const machines = await firstValueFrom(
            this._userService.findByEmail(this.form.get('email')?.value)
          );

          if (machines !== null) {
            this._alertService.show('Email already exists.', AlertEnum.ERROR);
            return;
          }

          if (
            this.form.get('username')?.hasError('required') &&
            this.form.get('username')?.touched
          ) {
            this._alertService.show('Username is required.', AlertEnum.ERROR);
          }

          if (
            this.form.get('email')?.touched &&
            this.form.get('email')?.invalid
          ) {
            if (this.form.get('email')?.errors?.['required']) {
              this._alertService.show('Email is required.', AlertEnum.ERROR);
            }
            if (this.form.get('email')?.errors?.['email']) {
              this._alertService.show('Email is not valid.', AlertEnum.ERROR);
            }
            return;
          }

          if (
            this.form.get('password')?.touched &&
            this.form.get('password')?.invalid
          ) {
            if (this.form.get('password')?.errors?.['required']) {
              this._alertService.show(
                'Password is not valid.',
                AlertEnum.ERROR
              );
            }
            if (this.form.get('password')?.errors?.['minlength']) {
              this._alertService.show(
                'Password need to have a length >= 8.',
                AlertEnum.ERROR
              );
            }
            if (this.form.get('password')?.errors?.['pattern']) {
              this._alertService.show(
                'Must include uppercase, lowercase, and a number.',
                AlertEnum.ERROR
              );
            }
            return;
          }

          if (
            (this.form.get('role')?.hasError('required') &&
              this.form.get('role')?.touched) ||
            this.form.get('role')?.value === 'NONE'
          ) {
            this._alertService.show("Role can not be 'NONE'.", AlertEnum.ERROR);
            return;
          }

          if (
            this.form.get('employee_name')?.hasError('required') &&
            this.form.get('employee_name')?.touched
          ) {
            this._alertService.show(
              'Employee name is required.',
              AlertEnum.ERROR
            );
          }

          if (
            this.form.get('department')?.hasError('required') &&
            this.form.get('department')?.touched
          ) {
            this._alertService.show('Department is required.', AlertEnum.ERROR);
          }

          if (
            (this.form.get('employee_role')?.hasError('required') &&
              this.form.get('employee_role')?.touched) ||
            this.form.get('employee_role')?.value === 'NONE'
          ) {
            this._alertService.show(
              "Employee role can not be 'NONE'.",
              AlertEnum.ERROR
            );
            return;
          }

          if (this.form.valid) {
            const user: User = {
              id: null,
              username: this.form.get('username')?.value,
              email: this.form.get('email')?.value,
              password: this.form.get('password')?.value,
              role: this.form.get('role')?.value,
              employees_id: {
                id: null,
                name: this.form.get('employee_name')?.value,
                department: this.form.get('department')?.value,
                hire_date: this.form.get('hire_date')?.value,
                role: this.form.get('employee_role')?.value,
              },
            };
            this._userService.save(user).subscribe({
              next: (user) => {
                console.log('User created successfully:', user);
                this._alertService.show(
                  'User created successfully.',
                  AlertEnum.SUCCESS
                );
                this.setFormDefaults();
              },
              error: (error) => {
                console.error('Error creating user:', error);
              },
            });
          }
        } catch (error) {
          console.error('Error:', error);
        }
        break;
      }
      case ENUM.Machine: {
        try {
          const machines = await firstValueFrom(
            this._machineService.findMachinesByNameOrId(
              this.form.get('name')?.value
            )
          );

          if (machines !== null) {
            this._alertService.show('Machine name existing.', AlertEnum.ERROR);
            return;
          }

          if (
            this.form.get('name')?.hasError('required') &&
            this.form.get('name')?.touched
          ) {
            this._alertService.show('Name is required.', AlertEnum.ERROR);
          }

          if (
            this.form.get('type')?.hasError('required') &&
            this.form.get('type')?.touched
          ) {
            this._alertService.show('Type is required.', AlertEnum.ERROR);
          }

          if (
            (this.form.get('status')?.hasError('required') &&
              this.form.get('status')?.touched) ||
            this.form.get('status')?.value === 'NONE'
          ) {
            this._alertService.show(
              'Status can not be "NONE".',
              AlertEnum.ERROR
            );
            return;
          }
          if (this.form.valid) {
            const machine: Machines = {
              id: null,
              name: this.form.get('name')?.value,
              type: this.form.get('type')?.value,
              status: this.form.get('status')?.value,
              last_maintenance: new Date(),
            };
            this._machineService.save(machine).subscribe({
              next: (savedMachine) => {
                console.log('Machine created successfully:', savedMachine);
                this._alertService.show(
                  'Machine created successfully.',
                  AlertEnum.SUCCESS
                );
                this.form.reset();
                this.setFormDefaults();
              },
              error: (error) => {
                console.error('Error creating machine:', error);
              },
            });
          }
        } catch (error) {
          console.error('Error:', error);
        }
        break;
      }
      default: {
        console.error('not find onSaveNewInstance()');
      }
    }
  }

  private addEvent(card: Card) {
    this.setFormDefaults();
    switch (card.name) {
      case ENUM.User: {
        this.configs = [
          {
            label: 'Username',
            icon: ICONS.EMPLOYEE,
            formControlName: 'username',
            type: 'text',
            placeholder: 'Enter username',
          },
          {
            label: 'Password',
            icon: ICONS.PASSWORD,
            formControlName: 'password',
            type: 'password',
            placeholder: 'Enter password',
          },
          {
            label: 'Email',
            icon: ICONS.EMAIL,
            formControlName: 'email',
            type: 'email',
            placeholder: 'Enter email',
          },
          {
            label: 'Role',
            icon: ICONS.ROLE,
            formControlName: 'role',
            type: 'select',
            options: ['NONE', ...Object.keys(UserRole)],
            placeholder: 'Enter role',
          },
          {
            label: 'Employee Name',
            icon: ICONS.EMPLOYEE,
            formControlName: 'employee_name',
            type: 'text',
            placeholder: 'Enter employee name',
          },
          {
            label: 'Department',
            icon: ICONS.DEPARTMENT,
            formControlName: 'department',
            type: 'text',
            placeholder: 'Enter department',
          },
          {
            label: 'Employee Role',
            icon: ICONS.ROLE,
            formControlName: 'employee_role',
            type: 'select',
            options: ['NONE', ...Object.keys(EmployeeRole)],
            placeholder: 'Enter employee role',
          },
        ];
        break;
      }
      case ENUM.Machine: {
        this.configs = [
          {
            label: 'Name',
            icon: ICONS.ROLE,
            formControlName: 'name',
            type: 'text',
            placeholder: 'Enter name',
          },
          {
            label: 'Type',
            icon: ICONS.ROLE,
            formControlName: 'type',
            type: 'text',
            placeholder: 'Enter type',
          },
          {
            label: 'Status',
            icon: ICONS.ROLE,
            formControlName: 'status',
            type: 'select',
            options: ['NONE', ...Object.keys(MachineStatus)],
            placeholder: 'Enter status',
          },
        ];
        break;
      }
      default: {
        console.error('Unknown card type');
      }
    }
  }

  private setFormDefaults() {
    switch (this.cardSelected.name) {
      case ENUM.User: {
        this.form = this._fb.group({
          username: ['', Validators.required],
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
            ],
          ],
          email: ['', [Validators.required, Validators.email]],
          role: ['NONE', Validators.required],
          employee_name: ['', Validators.required],
          department: ['', Validators.required],
          employee_role: ['NONE', Validators.required],
        });
        break;
      }
      case ENUM.Machine: {
        this.form = this._fb.group({
          name: ['', Validators.required],
          type: ['', Validators.required],
          status: ['NONE', Validators.required],
        });
        break;
      }
    }
  }
}
type TYPES = User | Machines;
enum ENUM {
  User = 'User',
  Machine = 'Machine',
}
