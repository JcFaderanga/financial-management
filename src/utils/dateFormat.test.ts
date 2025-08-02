import { FormatDate,FormattedUTCDate } from "./DateFormat";
import {test, describe, expect} from 'vitest'


describe('FormatDate', ()=>{
    test('if FormatDate return a correct format yyyy-mm-dd',()=>{
        expect(FormatDate('2025-08-02 12:25:00.555+00')).toBe('2025-08-02')
    });
});


describe('FormattedUTCDate', ()=>{
    test('if FormattedUTCDate return a correct format yyyy-mm-dd hh:mm:ss.ms+00',()=>{
        expect(
            FormattedUTCDate('2025-07-02')
        ).toBe(
            FormattedUTCDate('2025-07-02 13:08:46.006000+00')
        )
    });

    test('if FormattedUTCDate return "invalid date" if format is not yyyy-mm-dd hh:mm:ss.ms+00',()=>{
        expect(FormattedUTCDate('2025-07-02 - 2025-08-02')).toBe('invalid date')
    });

    test('if FormattedUTCDate accept letter',()=>{
        expect(FormattedUTCDate('ABC')).toBe('invalid date')
    });

});

