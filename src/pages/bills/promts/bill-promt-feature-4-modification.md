
Read the existing docs/BILL_PAGE_IMPLEMENTATION.md and implement the following Bill Table modifications directly in the existing codebase.

Do not just explain the changes. Inspect the current implementation first, then make the actual code changes.

Table

Modify the Bills table with these requirements:

Columns

The table must have exactly these columns in this order:

1. Select
2. Bill Name
3. Bill Amount
4. Status
5. Due Date
6. Paid Date
7. Date Created

Remove the existing Action column.

Responsive Table

* Table columns and their data must never shrink to the point that the content becomes difficult to read.
* The table must support horizontal scrolling when it does not fit the available screen width.
* Keep the table readable on mobile and smaller screens.
* Do not hide or remove columns to make the table fit.
* Preserve the existing page layout.

Sorting

Add sorting functionality to the table header.

Sorting must ONLY be available for:

* Bill Name
* Bill Amount
* Due Date
* Date Created
* Paid Date

Do not add sorting to:

* Select
* Status

Allow users to toggle sorting direction where appropriate, such as ascending/descending.

Handle empty/null Paid Date and Due Date values safely when sorting.

⸻

Status Column

Replace the current editable dropdown in the table with a display-only status element.

Display only:

Unpaid
Paid using {payment method}

Styling

Unpaid:

* Orange text
* Orange border

Paid:

* Green text
* Green border

The status displayed in the table must reflect the actual stored payment status and payment method.

The table Status must NOT directly change the payment status.

Status changes must happen through the Update Bill modal or Bulk Action.

⸻

Bulk Actions

Allow users to select multiple bills using the first column.

Select Column

* Add a checkbox/select control as the first column.
* Each bill row must have its own checkbox.
* Add a select-all checkbox in the table header.
* Select-all must select/deselect all currently displayed bills.
* Selection must remain synchronized with the displayed bill list.
* Do not accidentally select bills that are not part of the current displayed month.

Bulk Action Button

Create a bulk action dropdown button.

The dropdown must contain:

Update Status
Delete Bills

The bulk action button should be disabled or unavailable when no bills are selected.

⸻

Bulk Delete

When the user selects Delete Bills:

1. Display the existing delete confirmation modal/pattern.
2. The confirmation must show the number of selected bills.
3. Use this format:

Are you sure you want to delete these 3 items? This action cannot be undone.

Replace 3 dynamically with the number of selected bills.

For bulk deletion, display:

(x) items

where x is the number of selected bills.

Important

* This wording is ONLY for bulk deletion.
* Single-bill deletion must continue displaying the bill name.
* Do not change the existing single-delete confirmation behavior unnecessarily.

After confirmation:

* Delete all selected bills.
* Update localStorage.
* Recalculate affected monthly totals.
* Clear the selected bills.
* Refresh the table.

⸻

Bulk Update Status

When the user selects Update Status:

1. Open the existing Choose Payment Method modal.
2. Allow the user to select a payment method/account.
3. Support the existing Other payment method.
4. If Other is selected, allow the user to enter a custom payment method.
5. Apply the selected payment method/status to ALL selected bills.
6. Set the selected bills’ status to Paid.
7. Set Paid Date appropriately using the existing payment behavior.
8. Persist all changes to localStorage.
9. Recalculate the affected monthly totals.
10. Clear the selected bills after successful update.
11. Refresh the table.

Do not update only the first selected bill. The operation must apply to every selected bill.

⸻

Delete Bill

There must be two ways to delete a bill:

1. Bulk Action → Delete Bills
2. Delete from the Update Bill modal

Do NOT add a Delete button to every table row.

⸻

Row Click → Update Bill Modal

The entire bill row should be clickable.

When the user clicks a row:

* Open the existing Update Bill modal.
* Populate the modal with the selected bill’s current data.
* Allow the user to update the bill.

Important

Clicking the checkbox must NOT open the Update Bill modal.

Clicking other interactive elements inside the row should also not accidentally trigger the row click.

Use appropriate event handling such as stopping event propagation where necessary.

⸻

Update Bill Modal

The Update Bill modal must contain:

1. Bill Name

Editable.

2. Bill Amount

Editable.

3. Bill Status

The Bill Status must NOT be a normal select dropdown.

Use a div or button styled as a full-width status control.

Unpaid

100% width
Orange border
Orange text

Paid

100% width
Green border
Green text

Clicking the Bill Status control must open the existing Choose Payment Method modal.

The user can then change the bill’s payment status/payment method.

⸻

Payment Method / Other

When the user selects:

Other

allow the user to enter a custom payment method.

The custom payment method must be persisted to localStorage.

After saving a custom payment method:

* It must become available as a future payment method option.
* Do not lose the custom payment method after page refresh.
* Do not hardcode custom payment methods.
* Reuse previously saved custom payment methods where appropriate.

Status Display

If the user saves:

Other → ShopeePay

the table must display:

Paid using ShopeePay

The same behavior must apply to any custom payment method.

⸻

Due Date

Due Date must be optional.

This applies to BOTH:

* Create Bill modal
* Update Bill modal

The user must be able to create/update a bill without entering a Due Date.

Handle empty/null Due Date values safely in:

* Table display
* Sorting
* Update modal
* localStorage

Do not display invalid dates for bills without a Due Date.

⸻

Date Created

Date Created must be displayed in the Update Bill modal.

The user must be able to edit Date Created.

When Date Created changes:

1. Move the bill to the appropriate month/year group.
2. Update localStorage.
3. Recalculate the previous month’s totals.
4. Recalculate the new month’s totals.
5. Update the current table.
6. Keep the bill’s other properties unchanged.

Date Created remains the source of truth for monthly grouping.

⸻

Monthly Data

Preserve the existing monthly localStorage architecture.

Bills must continue to be grouped by month and year using Date Created.

Use a stable month/year identifier such as:

YYYY-MM

Example:

2026-09
2026-10

Each monthly object should maintain:

month
year
bills
totalAmount
paid
unpaid

Maintain this invariant:

totalAmount = paid + unpaid

Recalculate affected monthly totals after:

* Create
* Update
* Delete
* Bulk Delete
* Mark Paid
* Bulk Update Status
* Amount change
* Date Created change

⸻

General UI

Clickable Elements

All clickable elements must have:

cursor-pointer

This includes:

* Buttons
* Dropdowns
* Status controls
* Checkboxes/select controls where appropriate
* Clickable table rows
* Sorting controls
* Other interactive elements

Do not add cursor-pointer to elements that are not actually interactive.

Mobile Responsiveness

Maintain mobile responsiveness.

The table should use horizontal scrolling rather than shrinking its columns.

For example, use an appropriate structure similar to:

<div className="overflow-x-auto">
    <table className="min-w-max">
        ...
    </table>
</div>

Use the project’s existing styling conventions rather than blindly copying this example.

⸻

Existing Components

Reuse existing project components and patterns.

Use:

import CustomInput from '@/components/inputs/CustomInputs'
import SubmitButton from '@/components/button/SubmitButton'
import ModalWrapper from '@/wrapper/ModalWrapper'

Use the existing:

useAccountStore
useAmountHidden

for account/payment-method functionality.

Do not create duplicate components if an existing component can support the requirement.

⸻

Important Implementation Rules

Before modifying code:

1. Inspect Bills.tsx.
2. Inspect existing bill types/interfaces.
3. Inspect existing localStorage logic.
4. Inspect existing payment-method logic.
5. Inspect useAccountStore.
6. Inspect the existing Choose Payment Method modal.
7. Inspect the existing Update Bill modal.
8. Inspect the Monthly Chart implementation.
9. Reuse existing functions/components where possible.

Do not:

* Create duplicate bill state unnecessarily.
* Hardcode account/payment methods.
* Add an Action column.
* Add row-level Delete buttons.
* Make Status directly editable from the table.
* Remove existing functionality unrelated to this task.
* Introduce unnecessary dependencies.
* Use any unless absolutely unavoidable.
* Modify unrelated pages/components.
* Replace existing architecture without a clear reason.

⸻

Final Verification

After implementation:

1. Verify the table horizontally scrolls on small screens.
2. Verify all seven columns are present in the correct order.
3. Verify only the five specified columns are sortable.
4. Verify null/empty dates do not break sorting.
5. Verify row click opens the Update modal.
6. Verify checkbox click does not open the Update modal.
7. Verify multiple bills can be selected.
8. Verify select-all works.
9. Verify Bulk Delete displays the correct number of selected items.
10. Verify single Delete still displays the bill name.
11. Verify Bulk Update Status updates every selected bill.
12. Verify custom payment methods are persisted.
13. Verify custom payment methods appear as future options.
14. Verify Paid using {payment method} displays correctly.
15. Verify Due Date is optional when creating and updating bills.
16. Verify Date Created can be edited.
17. Verify changing Date Created moves the bill to the correct month.
18. Verify monthly totals remain correct.
19. Verify localStorage remains synchronized.
20. Verify amount hiding still works.
21. Run:

npm run build

22. Fix any TypeScript, ESLint, or build errors.

Do not stop at planning. Make the actual changes and complete the implementation.