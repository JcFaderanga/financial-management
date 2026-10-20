WITH monthly_last_transaction AS (
    SELECT DISTINCT ON (DATE_TRUNC('month', created_at))
        DATE_TRUNC('month', created_at) AS month,
        (transaction_detail->>'new_available_balance')::NUMERIC AS ending_balance
    FROM transaction
    WHERE owner = 'a946fb54-28be-4ded-9cd1-bf856eb9a7e9'
    ORDER BY
        DATE_TRUNC('month', created_at) DESC,
        created_at DESC
),
monthly_balances AS (
    SELECT
        month,
        ending_balance,
        LAG(ending_balance) OVER (
            ORDER BY month
        ) AS previous_month_balance
    FROM monthly_last_transaction
)
SELECT
    TO_CHAR(month, 'MM-YYYY') AS month,
    GREATEST(
        ending_balance - previous_month_balance,
        0
    ) AS saving_increase
FROM monthly_balances
WHERE previous_month_balance IS NOT NULL
ORDER BY month DESC;