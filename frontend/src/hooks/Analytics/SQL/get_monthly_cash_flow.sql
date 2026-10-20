CREATE OR REPLACE FUNCTION get_monthly_cash_flow(
    p_owner UUID
)
RETURNS TABLE (
    month TEXT,
    total_incoming NUMERIC,
    total_outgoing NUMERIC
)
LANGUAGE PLPGSQL
STABLE
AS $$
BEGIN

    IF p_owner IS NULL THEN
        RAISE EXCEPTION 'User ID is required';
    END IF;

    IF p_owner <> auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized user';
    END IF;

    RETURN QUERY

    WITH daily_cash_flow AS (
        SELECT
            DATE(t.created_at) AS day,

            SUM(
                CASE
                    WHEN (t.transaction_detail->>'delta_amount')::numeric > 0
                    THEN (t.transaction_detail->>'delta_amount')::numeric
                    ELSE 0
                END
            ) AS daily_incoming,

            SUM(
                CASE
                    WHEN (t.transaction_detail->>'delta_amount')::numeric < 0
                    THEN ABS((t.transaction_detail->>'delta_amount')::numeric)
                    ELSE 0
                END
            ) AS initial_daily_outgoing

        FROM transaction t

        WHERE t.owner = p_owner
            AND t.owner = auth.uid()

        GROUP BY
            DATE(t.created_at)
    ),

    final_daily_cash_flow AS (
        SELECT
            day,
            daily_incoming,
            initial_daily_outgoing,

            GREATEST(
                initial_daily_outgoing - daily_incoming,
                0
            ) AS daily_outgoing

        FROM daily_cash_flow
    )

    SELECT
        TO_CHAR(
            DATE_TRUNC('month', day),
            'MM-YYYY'
        ) AS month,

        SUM(daily_incoming) AS total_incoming,
        SUM(daily_outgoing) AS total_outgoing

    FROM final_daily_cash_flow

    GROUP BY
        DATE_TRUNC('month', day)

    ORDER BY
        DATE_TRUNC('month', day) DESC;

END;
$$;