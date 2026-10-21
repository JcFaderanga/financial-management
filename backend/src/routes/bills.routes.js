import { Router } from 'express';
import {
  createBill,
  listBillMonthOptions,
  listBills,
  listMonthlyBillTotals,
  patchBills,
  removeBills,
} from '../controllers/bills.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import {
  billsQuerySchema,
  deleteBillsSchema,
  insertBillSchema,
  updateBillsSchema,
} from '../validators/bills.validator.js';

const router = Router();

router.use(requireAuth);
router.get('/month-options', listBillMonthOptions);
router.get('/monthly-totals', listMonthlyBillTotals);
router.get('/', validate(billsQuerySchema, 'query'), listBills);
router.post('/', validate(insertBillSchema), createBill);
router.patch('/', validate(updateBillsSchema), patchBills);
router.delete('/', validate(deleteBillsSchema), removeBills);

export default router;
