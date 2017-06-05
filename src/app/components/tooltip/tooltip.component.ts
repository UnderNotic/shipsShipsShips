import { Component, Input } from '@angular/core';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent {
  @Input() public id: string;
  @Input() public isVisible = false;
  @Input() public x: number;
  @Input() public y: number;

  constructor() {
  }

  getStyle() {
    return {
      'visibility': this.isVisible ? 'visible' : 'hidden',
      'top.px': this.y,
      'left.px': this.x
    };
  }

  mouseOver($event, id) {
    this.id = id;
    this.y = $event.Ba.clientY;
    this.x = $event.Ba.clientX;
    this.isVisible = true;
  }

  mouseOut() {
    this.isVisible = false;
  }
}
