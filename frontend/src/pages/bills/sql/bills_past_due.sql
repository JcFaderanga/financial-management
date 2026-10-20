CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.set_bill_past_due_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NEW.status IN ('pending', 'past_due') THEN
        IF NEW.due_date IS NOT NULL AND NEW.due_date::date < CURRENT_DATE THEN
            NEW.status := 'past_due';
        ELSIF NEW.status = 'past_due' THEN
            NEW.status := 'pending';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bills_set_past_due_status ON public.bills;

CREATE TRIGGER bills_set_past_due_status
BEFORE INSERT OR UPDATE OF due_date, status ON public.bills
FOR EACH ROW
EXECUTE FUNCTION public.set_bill_past_due_status();

UPDATE public.bills
SET status = 'past_due'
WHERE status = 'pending'
  AND due_date IS NOT NULL
  AND due_date::date < CURRENT_DATE;

SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'mark-past-due-bills-daily';

SELECT cron.schedule(
    'mark-past-due-bills-daily',
    '0 0 * * *',
    $$
        UPDATE public.bills
        SET status = 'past_due'
        WHERE status = 'pending'
          AND due_date IS NOT NULL
          AND due_date::date < CURRENT_DATE;
    $$
);
