import { ColorScaleService } from './color-scale.service';

describe('ColorScaleService', () => {
    const service = new ColorScaleService();

    it('should be green', () => {
        const result1 = service.getRgbColor(16, -10, 16);
        const result2 = service.getRgbColor(2.8, 1.8, 2.8);
        const green = 'rgb(0,255,0)';
        expect(result1).toBe(green);
        expect(result2).toBe(green);
    });

    it('should be red', () => {
        const result1 = service.getRgbColor(-10, -10, 5);
        const result2 = service.getRgbColor(1.8, 1.8, 2.8);
        const red = 'rgb(255,0,0)';
        expect(result1).toBe(red);
        expect(result2).toBe(red);
    });

    it('should be orange', () => {
        const result = service.getRgbColor(0, -10, 10);
        const orange = 'rgb(127,128,0)';
        expect(result).toBe(orange);
    });
});
