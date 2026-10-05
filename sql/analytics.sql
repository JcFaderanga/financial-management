WITH daily_cash_flow AS (
    SELECT
        u.email,
        TO_CHAR(t.created_at, 'MM-YYYY-DD') AS day,
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
    INNER JOIN auth.users u
        ON t.owner = u.id
    -- WHERE t.owner = 'a946fb54-28be-4ded-9cd1-bf856eb9a7e9'
    GROUP BY
        u.email,
        day
),
final_daily_cash_flow AS (
    SELECT
        email,
        day,
        daily_incoming,
        initial_daily_outgoing,
        GREATEST(
            initial_daily_outgoing - daily_incoming,
            0
        ) AS daily_outgoing
    FROM daily_cash_flow
)
-- SELECT *
-- FROM final_daily_cash_flow
-- ORDER BY
--     email,
--     day DESC;
SELECT
    email,
    TO_CHAR(TO_DATE(day, 'MM-YYYY-DD'), 'MM-YYYY') AS month,
    SUM(daily_incoming) AS total_incoming,
    SUM(daily_outgoing) AS total_outgoing
FROM final_daily_cash_flow
GROUP BY
    email,
    month
ORDER BY
    email,
    month
DESC;
