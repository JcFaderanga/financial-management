CREATE OR REPLACE FUNCTION public.get_monthly_bill_totals()
RETURNS TABLE (
    month_key text,
    total_amount numeric,
    paid numeric,
    unpaid numeric
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
    SELECT
        to_char(date_trunc('month', COALESCE(b.bill_group_date::date, b.created_at::date)), 'MM-YYYY') AS month_key,
        COALESCE(SUM(b.bill_amount), 0) AS total_amount,
        COALESCE(SUM(b.bill_amount) FILTER (WHERE b.status = 'paid'), 0) AS paid,
        COALESCE(SUM(b.bill_amount) FILTER (WHERE b.status <> 'paid'), 0) AS unpaid
    FROM public.bills AS b
    WHERE b.user_id = (SELECT auth.uid())
    GROUP BY date_trunc('month', COALESCE(b.bill_group_date::date, b.created_at::date))
    ORDER BY date_trunc('month', COALESCE(b.bill_group_date::date, b.created_at::date));
$$;

GRANT EXECUTE ON FUNCTION public.get_monthly_bill_totals() TO authenticated;
