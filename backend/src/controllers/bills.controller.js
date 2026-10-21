import {
  deleteBills,
  getBillMonthOptions,
  getBills,
  getMonthlyBillTotals,
  insertBill,
  updateBills,
} from '../services/bills.service.js';

export const listBills = async (req, res) => {
  const bills = await getBills({
    accessToken: req.accessToken,
    userId: req.user.id,
    ...req.validatedQuery,
  });
  res.status(200).json(bills);
};

export const createBill = async (req, res) => {
  const bill = await insertBill({
    accessToken: req.accessToken,
    userId: req.user.id,
    bill: req.body,
  });
  res.status(201).json(bill);
};

export const patchBills = async (req, res) => {
  const bills = await updateBills({
    accessToken: req.accessToken,
    userId: req.user.id,
    ids: req.body.ids,
    updates: req.body.updates,
  });
  res.status(200).json(bills);
};

export const removeBills = async (req, res) => {
  const ids = await deleteBills({
    accessToken: req.accessToken,
    userId: req.user.id,
    ids: req.body.ids,
  });
  res.status(200).json(ids);
};

export const listBillMonthOptions = async (req, res) => {
  const options = await getBillMonthOptions({ accessToken: req.accessToken });
  res.status(200).json(options);
};

export const listMonthlyBillTotals = async (req, res) => {
  const totals = await getMonthlyBillTotals({ accessToken: req.accessToken });
  res.status(200).json(totals);
};
