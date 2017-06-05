import { AgmCoreModule } from '@agm/core';
import { Component } from '@angular/core';
import { CsvReaderService } from '../../services/csv/csv-reader.service';
import { Observable } from 'rxjs/Observable';
import { Ship } from './../../services/csv/ship';
import { Store, State } from '@ngrx/store';
import 'rxjs/add/operator/take';
import {
    showMenu,
    hideMenu,
    loadShips,
    loadShipsIds,
    selectShipId,
    setShipsLoadingProgressLevel,
    setStartDate, setEndDate,
    IState
} from '../../redux/redux';

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    providers: [CsvReaderService]
})
export class MenuComponent {
    isMenuVisible: Observable<boolean>;
    shipsIds: Observable<Set<string>>;
    startDate: Observable<Date>;
    endDate: Observable<Date>;
    areShipsLoading: Observable<boolean>;
    shipsLoadingIndicatorLevel: Observable<number>;
    file: File;

    constructor(private store: Store<IState>, private csvService: CsvReaderService) {
        this.isMenuVisible = store.select(state => state.isMenuVisible);
        this.shipsIds = store.select(s => s.shipsIds);
        this.startDate = store.select(s => s.startDate);
        this.endDate = store.select(s => s.endDate);
        this.areShipsLoading = store.select(s => s.areShipsLoading);
        this.shipsLoadingIndicatorLevel = store.select(s => s.shipsLoadingIndicatorLevel);
    }

    onSelectChange(id) {
        this.store.dispatch(selectShipId(id));
    }

    onStartDateChange(date) {
        this.store.dispatch(setStartDate(new Date(date)));
    }

    onEndDateChange(date) {
        this.store.dispatch(setEndDate(new Date(date)));
    }

    async onLoadClick() {
        let state: IState;
        this.store.take(1).subscribe(s => state = s);
        try {
            const ships = await this.csvService.readShipsFromFile(
                this.file, state.startDate.valueOf(),
                state.endDate.valueOf(),
                [state.selectedShipId],
                l => this.store.dispatch(setShipsLoadingProgressLevel(Math.round(l)))
            );
            this.store.dispatch(loadShips(ships));
        } catch (exception) {
            console.error('Loading ships from file failed.');
            console.error(exception);
        }
    }

    async onChange($event) {
        this.file = $event.target.files[0];
        this.store.dispatch(hideMenu());
        try {
            const ids = await this.csvService.readShipsIdsFromFile(
                this.file, l => this.store.dispatch(setShipsLoadingProgressLevel(Math.round(l)))
            );
            this.store.dispatch(showMenu());
            this.store.dispatch(loadShipsIds(ids));
        } catch (exception) {
            console.error('Loading ships ids from file failed.');
            console.error(exception);
        }
    }
}
