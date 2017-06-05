import { Injectable } from '@angular/core';
import { Ship } from './ship';

@Injectable()
export class CsvReaderService {
    private readonly chunkSize = 256 * 1024;
    private readonly fileReader = new FileReader();

    async readShipsIdsFromFile(file: File, loadingProgressCb: Function = () => { }) {
        const parsingFunc = (splitted: Array<string>, resultItem: Array<string>) => {
            const item = splitted[0];
            if (!resultItem.includes(item)) {
                resultItem.push(item);
            }
        };
        return new Set(await this.readFromFile(file, parsingFunc, loadingProgressCb));
    }

    readShipsFromFile(file: File, startDateEpoch: number, endDateEpoch: number, shipsIds: string[], loadingProgressCb: Function = () => { }) {
        const parsingFunc = (splitted: Array<string>, resultItem: Array<Ship>) => {
            const id = splitted[0];
            const timestamp = parseInt(splitted[1]);

            if (startDateEpoch < timestamp && endDateEpoch > timestamp && shipsIds.includes(id)) {
                this.addToArrayWithMerge(resultItem,
                    { id, timestamp, speed: parseFloat(splitted[2]), lon: parseFloat(splitted[3]), lat: parseFloat(splitted[4]) }
                );
            }
        };
        return this.readFromFile(file, parsingFunc, loadingProgressCb);
    }

    private readFromFile<T>(file: File, parsingFunc: (splitted: Array<string>, resultItem: Array<T>) => void, loadingProgressCb: Function) {
        const fileSize = file.size;
        let offset = 0;
        let chunkReaderBlock = null;

        let lastUnhandledChunkPart = '';
        const result = new Array<T>();

        return new Promise<Array<T>>((resolve, reject) => {
            const readEventHandler = evt => {
                if (evt.target.error == null) {
                    offset += evt.target.result.length;
                    const splitted: Array<string> = evt.target.result.split(/[\r?\n]+/);

                    splitted[0] = lastUnhandledChunkPart.concat(splitted[0]);
                    lastUnhandledChunkPart = splitted[splitted.length - 1];

                    for (let i = 0; i < splitted.length - 1; i++) {
                        const item = splitted[i].split(',');
                        parsingFunc(item, result);
                    }
                    loadingProgressCb(offset / fileSize * 100);
                } else {
                    console.error(`Read error: ${evt.target.error}`);
                    reject(`Read error: ${evt.target.error}`);
                    return;
                }
                if (offset >= fileSize) {
                    loadingProgressCb(100);
                    resolve(result);
                    return;
                }

                chunkReaderBlock(offset, file);
            };

            chunkReaderBlock = (_offset, _file) => {
                const blob = _file.slice(_offset, this.chunkSize + _offset);
                this.fileReader.onload = readEventHandler;
                this.fileReader.readAsText(blob);
            };

            chunkReaderBlock(offset, file);
        });
    }

    private addToArrayWithMerge(array: Ship[], csvRow: CsvRow) {
        const found = array.find(s => s.id === csvRow.id);
        if (found) {
            found.coordinates.push({ lat: csvRow.lat, lon: csvRow.lon, speed: csvRow.speed });
        } else {
            array.push(new Ship(csvRow.id, csvRow.speed, csvRow.lon, csvRow.lat));
        }
    }
}

interface CsvRow {
    id: string;
    timestamp: number;
    speed: number;
    lon: number;
    lat: number;
}
