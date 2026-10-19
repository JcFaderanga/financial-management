18. Additional Bill Requirements

The following requirements extend the existing Bill Page implementation.

⸻

18.1 Overall Bills Total

Display the overall total amount of all bills on the Bills page.

Requirements

* Calculate the total from all bills.
* Do not calculate the total from only the currently selected month.
* The total should update automatically when:
    * A bill is created.
    * A bill is updated.
    * A bill is deleted.
    * A bill amount is changed.

Example

Total Bills
₱25,450.00

Use the existing application’s styling and theme.

⸻

19. Month Options

Create a Month Options control that allows the user to select which month’s bills are displayed.

Requirements

* Display available months based on the bills’ Date Created.
* Group bills by month and year.
* The month selector should clearly display both month and year.

Example:

Month
[ October 2026 ▼ ]
Options:
- October 2026
- September 2026
- August 2026
- July 2026

Default Month

By default, select the current month and year.

If there are no bills for the current month, still display the current month as the selected month.

Filtering Behavior

When the user selects a month:

* Display only bills created during the selected month.
* Update the displayed bill list.
* Update the monthly bill total.
* Keep the overall bills total separate from the selected month’s total.

⸻

20. Date Created

Add a new Date Created column to the Bills table.

Updated Table Columns

Column	Description
Bill Name	Name/description of the bill
Amount	Bill amount
Status	Payment status and payment method
Due Date	Bill due date
Date Created	Date the bill was created
Paid Date	Date the bill was paid
Action	Update and Delete actions

⸻

20.1 Bill Date / Date Created

When a bill is created:

Date Created = Current Date

The Date Created value must be automatically assigned when the bill is created.

Do not require the user to manually enter the Date Created during normal bill creation.

⸻

20.2 Editing Date Created

The user must be able to edit the Date Created when updating a bill.

Requirements

* Date Created should be displayed in the Update Bill modal.
* User can modify the Date Created.
* Save the updated Date Created value.
* After changing Date Created, the bill must be regrouped under the appropriate month.

Example

If:

Date Created = September 25, 2026

and the user changes it to:

Date Created = October 5, 2026

the bill must move from:

September 2026

to:

October 2026

after the update.

⸻

21. Group Bills by Month

Bills must be logically grouped based on their Date Created.

Important

The grouping must use:

Date Created

and not:

* Due Date
* Paid Date
* Date Updated

Example

October 2026
Internet       ₱1,500
Electricity    ₱2,300
Water          ₱800
September 2026
Internet       ₱1,500
Electricity    ₱2,100

The Month Options selector should allow the user to switch between these groups.

⸻

22. Monthly Bill Total

For the currently selected month, calculate and display the total amount of bills created during that month.

Example

October 2026
Monthly Bills
₱8,450.00

The monthly total should be calculated from the bills currently belonging to the selected month.

Behavior

The monthly total must update when:

* A bill is created.
* A bill is updated.
* A bill is deleted.
* A bill amount changes.
* A bill’s Date Created changes.
* The selected month changes.

⸻

23. Monthly Chart Integration

Connect the Bill data to the existing Monthly Chart.

The Monthly Chart must display the total amount of bills for each month.

Requirements

* Use each bill’s Date Created to determine which month it belongs to.
* Calculate the total bill amount per month.
* Pass the calculated monthly bill totals to the existing Monthly Chart.
* Do not create a separate chart if an existing Monthly Chart already exists.
* Extend the existing chart/data structure where possible.

Example Data

January 2026    ₱5,000
February 2026   ₱7,500
March 2026      ₱6,200
April 2026      ₱8,450

The chart should represent the monthly bill totals.

⸻

24. Monthly Chart Data Requirements

The monthly chart data should follow this general structure:

{
    month: 'October 2026',
    totalBills: 8450
}

Example:

[
    {
        month: 'January 2026',
        totalBills: 5000
    },
    {
        month: 'February 2026',
        totalBills: 7500
    },
    {
        month: 'March 2026',
        totalBills: 6200
    },
    {
        month: 'April 2026',
        totalBills: 8450
    }
]

Use the project’s existing data structure if the Monthly Chart already expects a different format. Do not unnecessarily change the existing chart API.

⸻

25. Relationship Between Month Filter and Monthly Chart

The Month Options filter and Monthly Chart should have clearly defined responsibilities.

Month Options

Controls the bills displayed in the Bills table.

Selected Month
      ↓
Bills Table
      ↓
Bills for Selected Month

Monthly Chart

Displays the total bills across months.

All Bills
      ↓
Group by Date Created
      ↓
Calculate Monthly Totals
      ↓
Monthly Chart

Changing the Month Options should not remove other months from the chart unless the existing chart’s design explicitly requires the chart to follow the selected month.

The chart should generally continue showing the monthly trend across the available bill data.

⸻

26. Overall Total vs Monthly Total

Keep these two values separate.

Overall Bills Total

Represents:

SUM(all bills)

Example:

Overall Bills Total
₱35,450.00

Selected Month Total

Represents:

SUM(bills for selected month)

Example:

October 2026 Bills
₱8,450.00

Do not confuse these values or use the monthly filtered list to calculate the overall total.

⸻

27. Updated Acceptance Criteria

Overall Total

* Overall Bills Total is displayed.
* Overall total includes all bills.
* Overall total is not affected by the selected month filter.
* Overall total updates after Create.
* Overall total updates after Update.
* Overall total updates after Delete.
* Overall total updates when bill amount changes.

Month Options

* Month Options control is available.
* Available months are based on Date Created.
* Month and year are displayed.
* Current month is selected by default.
* User can switch between months.
* Selecting a month filters the Bills table.
* Monthly total updates when the selected month changes.

Date Created

* Date Created column is displayed.
* New bills automatically receive the current date.
* Date Created is displayed in the Update Bill modal.
* User can edit Date Created.
* Updated Date Created is persisted.
* Changing Date Created moves the bill to the correct month group.

Monthly Grouping

* Bills are grouped based on Date Created.
* Due Date is not used for monthly grouping.
* Paid Date is not used for monthly grouping.
* Date Updated is not used for monthly grouping.

Monthly Bill Total

* Monthly bill total is displayed.
* Monthly total only includes bills created during the selected month.
* Monthly total updates after Create.
* Monthly total updates after Update.
* Monthly total updates after Delete.
* Monthly total updates when Date Created changes.
* Monthly total updates when Amount changes.

Monthly Chart

* Existing Monthly Chart is connected to bill data.
* Bills are grouped by Date Created.
* Total bill amount is calculated per month.
* Monthly bill totals are displayed in the chart.
* Chart data updates when bills change.
* Chart includes available monthly bill data.
* Existing chart functionality is preserved.
* No unnecessary duplicate chart is created.

⸻

28. Implementation Considerations

Before implementing the new requirements:

1. Inspect the existing Monthly Chart implementation.
2. Determine how chart data is currently generated.
3. Inspect existing bill data types/schema.
4. Verify whether Date Created already exists in the database/model.
5. If Date Created does not exist, add it using the project’s existing database migration/schema conventions.
6. Determine whether the existing bill query already returns Date Created.
7. Reuse existing date utilities if available.
8. Ensure date handling is consistent with the application’s timezone.
9. Avoid calculating monthly totals independently in multiple components.
10. Prefer a reusable data transformation/helper or hook if the existing architecture supports it.

Important Data Rule

The source of truth for monthly bill grouping must be the persisted:

Date Created

Do not derive Date Created from:

Due Date
Paid Date
Updated At

unless the existing database schema explicitly requires a different field.

⸻

29. Final Verification

After implementation:

1. Create a new bill.
2. Verify Date Created is automatically populated.
3. Verify the bill appears under the correct month.
4. Verify the overall total increases.
5. Verify the selected month’s total increases.
6. Verify the Monthly Chart updates.
7. Update the bill amount.
8. Verify all totals update.
9. Change Date Created to another month.
10. Verify the bill moves to the correct month.
11. Verify monthly totals update.
12. Verify the chart updates.
13. Delete the bill.
14. Verify the bill disappears.
15. Verify overall and monthly totals update.
16. Verify the chart updates.
17. Test the page at different screen sizes.
18. Run:

npm run build

19. Fix any TypeScript, ESLint, or build errors before considering the implementation complete.