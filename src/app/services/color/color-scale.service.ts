import { Injectable } from '@angular/core';

@Injectable()
export class ColorScaleService {
    getRgbColor(value: number, minValue: number, maxValue: number): string {
        const green = Math.round(255 * ((value - minValue) / Math.abs(minValue - maxValue)));
        const red = 255 - green;
        return `rgb(${red},${green},0)`;
    }
}
