import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GenInput } from './input';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() config!: GenInput;
  @Input() formGroup!: FormGroup;
  @Input() isTable: boolean = false;
  @Input() isPage: boolean = false;
  @Output() selectChange = new EventEmitter<any>();
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && changes['config'].currentValue) {
      this.config = changes['config'].currentValue;
    }
    if (changes['formGroup'] && changes['formGroup'].currentValue) {
      this.formGroup = changes['formGroup'].currentValue;
    }
  }

  getValuesByPaths(obj: any, paths?: string[]): string {
    if (!obj || !paths || paths.length === 0) {
      return typeof obj === 'string' ? obj : '';
    }

    if (typeof obj === 'string') {
      return obj;
    }

    return paths
      .map((path) =>
        path.split('.').reduce((acc, part) => acc?.[part] ?? '', obj)
      )
      .join(' - ');
  }

  onSelectChange(event: any): void {
    if (!this.isTable) {
      const target = event.target as HTMLInputElement | HTMLSelectElement;

      if (target.tagName === 'SELECT') {
        const selectEl = target as HTMLSelectElement;
        const selectedIndex = selectEl.selectedIndex;
        const selectedOption = this.config.options?.[selectedIndex];
        console.log('select');
        console.log(selectedOption);
        this.selectChange.emit(selectedOption);
      } else if (target.tagName === 'INPUT') {
        console.log('input');
        const inputEl = target as HTMLInputElement;

        if (inputEl.type === 'date') {
          const value = inputEl.value;
          console.log('date');
          const date = value ? new Date(value + 'T00:00:00') : null;
          this.selectChange.emit(date);
        } else {
          this.selectChange.emit(inputEl.value);
        }
      }
    } else {
      this.selectChange.emit(true);
    }
  }
}
