import { createSupabaseClient } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

const getAuthenticatedClient = (accessToken) => createSupabaseClient(accessToken);

const throwServiceError = (action, error, message = `Unable to ${action} bills`) => {
  console.error(`Supabase bill ${action} failed:`, error);
  throw new AppError(message, 502, 'BILLS_SERVICE_ERROR');
};

export const getBills = async ({ accessToken, userId, startDate, endDate }) => {
  const { data, error } = await getAuthenticatedClient(accessToken)
    .from('bills')
    .select('*')
    .eq('user_id', userId)
    .gte('bill_group_date', startDate)
    .lt('bill_group_date', endDate);

  if (error) {
    throwServiceError('fetch', error);
  }

  return data ?? [];
};

export const insertBill = async ({ accessToken, userId, bill }) => {
  const { data, error } = await getAuthenticatedClient(accessToken)
    .from('bills')
    .insert({ ...bill, user_id: userId })
    .select('*')
    .single();

  if (error) {
    throwServiceError('create', error);
  }

  return data;
};

export const updateBills = async ({ accessToken, userId, ids, updates }) => {
  const { data, error } = await getAuthenticatedClient(accessToken)
    .from('bills')
    .update(updates)
    .in('id', ids)
    .eq('user_id', userId)
    .select('*');

  if (error) {
    throwServiceError('update', error);
  }

  if (!data || data.length !== ids.length) {
    throw new AppError('One or more bills could not be updated', 404, 'BILLS_NOT_FOUND');
  }

  return data;
};

export const deleteBills = async ({ accessToken, userId, ids }) => {
  const { data, error } = await getAuthenticatedClient(accessToken)
    .from('bills')
    .delete()
    .in('id', ids)
    .eq('user_id', userId)
    .select('id');

  if (error) {
    throwServiceError('delete', error);
  }

  if (!data || data.length !== ids.length) {
    throw new AppError('One or more bills could not be deleted', 404, 'BILLS_NOT_FOUND');
  }

  return data.map(({ id }) => id);
};

export const getBillMonthOptions = async ({ accessToken }) => {
  const { data, error } = await getAuthenticatedClient(accessToken)
    .rpc('get_bill_month_options');

  if (error) {
    throwServiceError('fetch month options', error, 'Unable to fetch bill month options');
  }

  return data ?? [];
};

export const getMonthlyBillTotals = async ({ accessToken }) => {
  const { data, error } = await getAuthenticatedClient(accessToken)
    .rpc('get_monthly_bill_totals');

  if (error) {
    throwServiceError('fetch monthly totals', error, 'Unable to fetch monthly bill totals');
  }

  return data ?? [];
};
