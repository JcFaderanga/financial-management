Modify Bill Page: Paid/Unpaid Summary and Monthly LocalStorage

Read the existing implementation and modify it according to the following requirements. Make the changes directly in the codebase.

1. Replace Total Bills Card

Replace the existing Total Bills card with two summary values:

* Paid: Total amount of bills that have been paid. Text and value must be green.
* Unpaid: Total amount of bills that are still pending payment. Text and value must be orange.

Remove the existing Total Bills card.

Existing Code

<div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-light-dark dark:bg-medium-dark">
    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
        Total Bills
    </p>
    <div className="mt-2 text-xl font-bold text-dark dark:text-white">
        {isAmountHidden ? '*****' : <NumberFlow value={overallTotal} style="currency" currency="php" />}
    </div>
</div>

Requirements

* Display Paid and Unpaid amounts instead of Total Bills.
* Use green styling for both the Paid label and amount.
* Use orange styling for both the Unpaid label and amount.
* Follow the existing dark theme and card styling.
* Reuse NumberFlow for currency formatting.
* Respect isAmountHidden. When amounts are hidden, display ***** instead of the actual values.
* Use Tailwind classes consistent with the existing project.

Calculation Rules

Paid Amount

Sum the amounts of bills whose payment status is Paid.

Unpaid Amount

Sum the amounts of bills whose payment status is Pending Payment.

Paid Amount   = SUM(amount of paid bills)
Unpaid Amount = SUM(amount of unpaid bills)

Only calculate these values from bills belonging to the currently selected month.

Do not calculate these values using bills from every month.

⸻

2. Display Only Monthly Totals

The Bills page must display totals for the currently selected month only.

Requirements

* Use the existing Month Options selector.
* When a month is selected, display only the bills belonging to that month.
* The Paid and Unpaid summary values must reflect only the selected month’s bills.
* Do not display an overall total across all months.
* Do not combine amounts from different months in the summary cards.

Example

Suppose October contains:

* Internet: ₱1,500, unpaid
* Electricity: ₱2,000, paid
* Water: ₱500, unpaid

The summary should display:

Paid
₱2,000.00
Unpaid
₱2,000.00

Selecting September must recalculate the summary using September’s bills only.

⸻

3. Store Bills in localStorage by Month and Year

Modify the existing localStorage persistence logic so bills are organized by month and year.

Use the following conceptual structure:

{
  "September": {
    "bills": [
      {
        "id": "bill-1",
        "name": "Internet",
        "amount": 1500,
        "status": "Pending Payment",
        "dateCreated": "2026-09-10",
        "dueDate": "2026-09-20",
        "paidDate": null,
        "paymentMethod": null
      }
    ],
    "totalAmount": 1500,
    "paid": 0,
    "unpaid": 1500,
    "year": 2026
  },
  "October": {
    "bills": [
      {
        "id": "bill-2",
        "name": "Electricity",
        "amount": 2000,
        "status": "Paid",
        "dateCreated": "2026-10-05",
        "dueDate": "2026-10-15",
        "paidDate": "2026-10-14",
        "paymentMethod": "BPI"
      }
    ],
    "totalAmount": 2000,
    "paid": 2000,
    "unpaid": 0,
    "year": 2026
  }
}

This is a conceptual example. Preserve all existing bill properties required by the application.

Important: Use a Stable localStorage Structure

Use a consistent object structure that supports multiple years.

Prefer a month-and-year key, such as:

2026-09
2026-10
2027-09

For example:

{
  "2026-09": {
    "month": "September",
    "year": 2026,
    "bills": [],
    "totalAmount": 2412,
    "paid": 100,
    "unpaid": 2312
  },
  "2026-10": {
    "month": "October",
    "year": 2026,
    "bills": [],
    "totalAmount": 0,
    "paid": 0,
    "unpaid": 0
  }
}

Use YYYY-MM as the storage key rather than the month name alone. This prevents September 2026 from being mixed with September 2027.

The month property should contain the full month name for display.

⸻

4. Calculate Monthly Totals Automatically

Do not rely on manually maintained totals that can become inconsistent with the bills array.

Calculate or derive these values from the bills belonging to each month:

totalAmount = Sum of all bill amounts
paid        = Sum of amounts for paid bills
unpaid      = Sum of amounts for pending bills

The following invariant must always hold:

totalAmount = paid + unpaid

Recalculate the monthly values after every relevant operation:

* Creating a bill
* Updating a bill
* Deleting a bill
* Changing a bill’s amount
* Marking a bill as paid
* Changing payment status
* Changing Date Created
* Changing the selected month

Ensure that calculations do not double-count bills.

⸻

5. Group Bills Using Date Created

Use each bill’s dateCreated to determine its month and year.

When Date Created is edited:

1. Remove the bill from its previous month group.
2. Add the bill to the new month group.
3. Recalculate the totals for both affected months.
4. Update localStorage.
5. Refresh the displayed bills and summary values.

Do not group bills using Due Date or Paid Date.

⸻

6. Persistence and State Management

Before implementing changes:

1. Inspect the existing localStorage implementation.
2. Inspect the current bill types and interfaces.
3. Inspect the Month Options selector.
4. Inspect how bill totals and payment status are currently calculated.
5. Reuse the existing state management and persistence patterns where possible.

Requirements

* Use the existing localStorage key if one already exists.
* Preserve existing bill data during updates.
* Avoid creating duplicate localStorage entries or competing sources of truth.
* Ensure React state stays synchronized with localStorage.
* Ensure changes remain available after refreshing the page.
* Handle missing or invalid localStorage data gracefully.
* If existing stored data uses a different structure, implement a safe migration that preserves existing bills.

Prefer deriving monthly totals from each month’s bills rather than storing independently calculated values in multiple places.

If the existing architecture requires totals to be stored in localStorage, update those totals whenever the bills change.

⸻

7. Acceptance Criteria

* The Total Bills card is removed.
* A Paid summary is displayed in green.
* An Unpaid summary is displayed in orange.
* Both summaries respect the amount-hiding setting.
* Paid totals include only paid bills.
* Unpaid totals include only pending bills.
* Summary values reflect the selected month only.
* Bills are grouped by month and year using Date Created.
* localStorage supports multiple years without mixing identical month names.
* Each month stores its bills and corresponding totals.
* Monthly totals are recalculated after CRUD operations.
* Monthly totals are recalculated after payment status changes.
* Changing Date Created moves a bill to the correct month.
* Existing bill data and functionality are preserved.
* Data persists after refreshing the page.
* The UI follows the existing theme and responsive layout.

8. Final Verification

After implementation:

1. Inspect the final changes.
2. Create a paid bill and an unpaid bill.
3. Verify Paid and Unpaid amounts.
4. Change the selected month and verify both amounts.
5. Edit a bill’s amount and verify the totals.
6. Mark a bill as paid and verify the totals.
7. Move a bill to another month by editing Date Created.
8. Verify both affected months’ totals.
9. Refresh the page and verify localStorage persistence.
10. Run npm run build and fix any errors.

Implement the changes directly in the existing codebase. Do not just explain the solution or provide code snippets. Do not modify unrelated functionality.