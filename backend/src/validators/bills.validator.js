import { z } from 'zod';

const isCalendarDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

const billDate = z.string().refine(isCalendarDate, 'Must be a valid YYYY-MM-DD date');
const nullableBillDate = billDate.nullable();
const nullableText = z.string().nullable();

const billFields = {
  bill_name: z.string().trim().min(1, 'Bill name is required'),
  bill_amount: z.number().finite().positive('Bill amount must be greater than zero'),
  status: z.enum(['pending', 'paid', 'past_due']),
  due_date: nullableBillDate,
  paid_date: nullableBillDate,
  bill_group_date: nullableBillDate,
  payment_method: nullableText,
  payment_account: nullableText,
  custom_payment_method: nullableText,
};

const billIds = z.array(
  z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
).min(1).refine((ids) => new Set(ids).size === ids.length, 'Bill IDs must be unique');

export const billsQuerySchema = z.object({
  startDate: billDate,
  endDate: billDate,
}).refine(({ startDate, endDate }) => startDate < endDate, {
  message: 'endDate must be after startDate',
  path: ['endDate'],
});

export const insertBillSchema = z.object(billFields).strict();

export const updateBillsSchema = z.object({
  ids: billIds,
  updates: z.object({
    ...Object.fromEntries(
      Object.entries(billFields).map(([key, schema]) => [key, schema.optional()]),
    ),
  }).strict().refine((updates) => Object.keys(updates).length > 0, {
    message: 'At least one bill field must be provided for update',
  }),
}).strict();

export const deleteBillsSchema = z.object({
  ids: billIds,
}).strict();
