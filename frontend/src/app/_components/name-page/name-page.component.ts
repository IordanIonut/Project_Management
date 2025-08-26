import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NamePage } from './name-page';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Machines } from '../../_model/_interface/machine';
import { ICONS } from '../../_shared/icons';

@Component({
  selector: 'app-name-page',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './name-page.component.html',
  styleUrl: './name-page.component.scss',
})
export class NamePageComponent {
  @Input() page!: NamePage;
  @Input() type!: boolean;
  @Input() isHiddenInformation!: boolean;

  @Input() isAddHidden: boolean = false;
  @Input() isEditHidden: boolean = false;
  @Input() isDeleteHidden: boolean = false;
  @Input() isBackHidden: boolean = false;

  @Output() onType: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onEdit: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
  @Output() onAdd: EventEmitter<void> = new EventEmitter<void>();
  @Output() onBack: EventEmitter<void> = new EventEmitter<void>();

  ICONS = ICONS;
  constructor() {}

  onChangeVisibility() {
    this.type = !this.type;
    this.onType.emit(this.type);
  }

  onEditEvent() {
    this.onEdit.emit();
  }

  onDeleteEvent() {
    this.onDelete.emit();
  }

  onAddEvent() {
    this.onAdd.emit();
  }

  onBackEvent() {
    this.onBack.emit();
  }
}
