import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { Card } from '../../_model/_common/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() card!: Card;
  @Input() cardSelected!: Card;
  @Output() cardClicked = new EventEmitter<any>();

  constructor() {}

  ngAfterViewInit(): void {}

  onCardClick() {
    this.cardClicked.emit(this.card);
  }
}
