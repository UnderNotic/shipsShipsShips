import { CsvReaderService } from './csv-reader.service';
import { TestBed, inject, async } from '@angular/core/testing';
import { Ship } from 'app/services/csv/ship';

describe('CsvReaderService', () => {
    const service = new CsvReaderService();

    const sampleData = `219000674, 1493598934602, 1.1, 10.412933, 54.89156
219000674, 1493598934696, 1.1, 10.412933, 51
1, 1493598945165, 2.8, 10.413096, 54.89161
219000674, 1493598945179, 2.8, 10.413096, 53`;

    it('should return set of ids', async(() => {
        const file = new File([sampleData], 'filename');

        service.readShipsIdsFromFile(file).then(res => {
            expect(Array.from(res)).toEqual(['219000674', '1']);
        });
    }));

    it('should return parsed ships', async(() => {
        const file = new File([sampleData], 'filename');
        let ship1 = new Ship('219000674', 1.1, 10.412933, 54.89156);
        ship1.coordinates.push({ lon: 10.412933, lat: 51, speed: 1.1 });
        let ship2 = new Ship('1', 2.8, 10.413096, 54.89161);

        service.readShipsFromFile(file, 1493598934601, 1493598945166, ['219000674', '1']).then(res => {
            expect(res).toEqual([ship1, ship2]);
        });
    }));

    it('should combine chunks', async(() => {
        let sampleBigData = '';
        const result = new Set<string>();
        for (let i = 0; i < 1000; i++) {
            const id = i % 99;
            sampleBigData = sampleBigData.concat(`${id}, 1, 1.1, 10.412933, 54.89156\n`);
            result.add(id.toString());
        }
        const file = new File([sampleBigData], 'filename');

        service.readShipsIdsFromFile(file).then(res => {
            expect(Array.from(res)).toEqual(Array.from(result));
        });
    }));
});
