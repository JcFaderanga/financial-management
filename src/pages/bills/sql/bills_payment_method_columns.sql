ALTER TABLE public.bills
    ADD COLUMN IF NOT EXISTS payment_method text,
    ADD COLUMN IF NOT EXISTS payment_account text,
    ADD COLUMN IF NOT EXISTS custom_payment_method text;

CREATE INDEX IF NOT EXISTS bills_user_group_date_idx
    ON public.bills (user_id, bill_group_date);

CREATE OR REPLACE FUNCTION public.get_bill_month_options()
RETURNS TABLE (month_key text, custom_payment_method text)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
    SELECT DISTINCT
        to_char(date_trunc('month', COALESCE(b.bill_group_date::date, b.created_at::date)), 'YYYY-MM') AS month_key,
        b.custom_payment_method
    FROM public.bills AS b
    WHERE b.user_id = (SELECT auth.uid())
    ORDER BY month_key DESC, b.custom_payment_method;
$$;

GRANT EXECUTE ON FUNCTION public.get_bill_month_options() TO authenticated;
