import {test, describe, expect} from 'vitest'
import { CategoryAndPrice } from './itemFormat';
import { itemTypes } from '@/types/itemTypes';

const TEST_DATA:itemTypes[] = [
  {"id": 338,"owner": "1","title": "sogo","price": 1380,"category": "Staycation",},
  {"id": 337,"owner": "2","title": "kuya j","price": 1500,"category": "Food",},
  {"id": 336,"owner": "3","title": "mcdo","price": 2000,"category": "Food",},
  {"id": 335,"owner": "4","title": "loan","price": 2800,"category": "Payments",}
];

describe('GroupByCategoryAndPrice', ()=>{
    test('returns an object with category-price pairs', () => {
        const result = new CategoryAndPrice(TEST_DATA);
        expect(result.grouped()).toMatchObject({
            Staycation: 1380,
            Food: 3500,
            Payments: 2800,
        });
    });
})
