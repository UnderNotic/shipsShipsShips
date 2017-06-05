import { Observable } from 'rxjs/Observable';
import { AgmCoreModule } from '@agm/core';
import { Component, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { TooltipComponent } from './../tooltip/tooltip.component';
import { CsvReaderService } from '../../services/csv/csv-reader.service';
import { ColorScaleService } from '../../services/color/color-scale.service';
import { Ship } from './../../services/csv/ship';
import { Store, State } from '@ngrx/store';
import 'rxjs/add/operator/map';
import { IState, selectShipId } from '../../redux/redux';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TooltipComponent, CsvReaderService, ColorScaleService]
})
export class MapComponent {
  minMaxSpeeds: Observable<number[]>;
  coordinatesNumber: Observable<number>;
  ships: Observable<Ship[]>;
  tooltip: {
    id: string;
    isVisible;
    x: number;
    y: number;
  } = { id: '', isVisible: false, x: 0, y: 0 };

  constructor(private store: Store<IState>, public colorScaleService: ColorScaleService) {
    this.ships = this.store.select(s => s.ships);
    this.minMaxSpeeds = this.ships.map(ships => {
      const initValue = ships[0] ? ships[0].coordinates[0].speed : null;
      return ships.reduce((res, ship) => {
        const shipRes = ship.coordinates.reduce((interRes, coord) => {
          if (interRes[0] > coord.speed) {
            return [coord.speed, interRes[0]];
          } else if (interRes[1] < coord.speed) {
            return [interRes[0], coord.speed];
          }
          return interRes;
        }, res);
        return [Math.min(shipRes[0], res[0]), Math.max(shipRes[1], res[1])];
      }, [initValue, initValue]);
    });
    this.coordinatesNumber = this.ships.map(ships => ships.reduce((res, s) => res + s.coordinates.length, 0));
  }


  mouseOver($event, id) {
    this.tooltip.id = id;
    this.tooltip.y = $event.Ba.clientY;
    this.tooltip.x = $event.Ba.clientX;
    this.tooltip.isVisible = true;
  }

  mouseOut() {
    this.tooltip.isVisible = false;
  }
}
