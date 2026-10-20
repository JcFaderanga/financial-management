Bill Page Implementation

Objective

Modify Bills.tsx to create a complete Bill Management page where users can:

* View all bills in a table.
* Create new bills.
* Update existing bills.
* Delete bills.
* Mark bills as paid.
* Select the account/payment method used when paying a bill.
* Edit the paid date.

Use the existing project architecture, components, stores, styling conventions, and coding patterns. Do not introduce a new UI pattern if an existing component or pattern already exists in the project.

⸻

1. Bills Page

File to modify

Bills.tsx

Create/modify the page so that it displays the user’s bills in a modern, responsive table.

Table Columns

Column	Description
Bill Name	Name/description of the bill
Amount	Amount that needs to be paid
Status	Payment status and payment method
Due Date	Bill due date
Paid Date	Date the bill was paid
Action	Update and Delete actions

⸻

2. Bill Creation

Add an “Add Bill” button at the top of the page.

Behavior

1. User clicks Add Bill.
2. Open the existing ModalWrapper.
3. Display a bill form inside the modal.
4. User enters the required bill information.
5. User submits the form.
6. Create the bill using the existing project data/API/database architecture.
7. Close the modal after successful creation.
8. Refresh/update the bill list so the newly created bill appears immediately.

Bill Form

Include appropriate fields for:

* Bill Name
* Amount
* Due Date

Use the existing custom input component:

import CustomInput from '@/components/inputs/CustomInputs'

Use the existing button component:

import SubmitButton from '@/components/button/SubmitButton'

Do not create a new input or button component unless absolutely necessary.

⸻

3. Bill Update

Use the same modal used for bill creation.

Behavior

1. User clicks Update in the Action column.
2. Open the existing ModalWrapper.
3. Populate the form with the selected bill’s existing values.
4. Allow the user to modify the bill.
5. Submit the changes.
6. Update the bill using the existing project architecture.
7. Close the modal after successful update.
8. Refresh/update the table immediately.

The modal should determine whether it is in Create or Update mode based on whether a bill is being edited.

Avoid duplicating the form/UI for Create and Update.

⸻

4. Bill Deletion

The Action column must contain a Delete button.

Behavior

1. User clicks Delete.
2. Ask for confirmation before deleting the bill.
3. If confirmed, delete the selected bill.
4. Update the table immediately after successful deletion.

Do not delete a bill accidentally from a single click.

⸻

5. Bill Payment

Users must be able to mark a bill as paid directly from the Status column.

Status Interaction

The Status column must contain a dropdown/select control.

The dropdown should have:

Pending Payment
Paid using {payment method}

For example:

Pending Payment
Paid using BPI
Paid using GCash
Paid using Other

⸻

5.1 Pending Payment

When a bill is pending:

* Display Pending Payment.
* Dropdown border must be orange.
* Text must be orange.
* User can select a payment method to mark the bill as paid.

⸻

5.2 Mark Bill as Paid

When the user selects a payment method:

1. Open the payment modal.
2. Display the user’s available accounts.
3. Allow the user to select which account was used to pay the bill.
4. Allow the user to choose Other as a payment method.
5. If Other is selected, display an input allowing the user to enter their preferred payment method.
6. After confirmation:
    * Update the bill status to Paid.
    * Save the selected payment method/account.
    * Set Paid Date to the current date by default.
    * Update the table immediately.

⸻

6. Account Store Integration

Use the existing account store:

import { useAccountStore, useAmountHidden } from '@/store/useAccountStore'

Use the account data from useAccountStore when displaying available accounts/payment methods.

Also use useAmountHidden wherever account amounts/balances are displayed, following the existing application behavior for hiding account amounts.

Do not create duplicate account state or hardcoded account data.

⸻

7. Paid Date

Default behavior

When a bill changes from Pending to Paid:

Paid Date = current date

Editing Paid Date

The user must be able to manually edit the Paid Date after the bill has been marked as paid.

For example:

Paid Date: October 16, 2026
             [Edit]

When the user edits the date, save the new date to the bill.

For pending bills, Paid Date should remain empty/null.

⸻

8. Payment Method

Payment method should support:

Existing accounts

Use accounts retrieved from:

useAccountStore

Examples:

BPI
BDO
GCash
Maya

Other

Include:

Other

When Other is selected:

* Display an additional input.
* Allow the user to enter a custom payment method.
* Save the custom payment method with the bill.

Do not hardcode specific account names. Use the accounts available from the existing store.

⸻

9. Modal

Use the existing modal component:

import ModalWrapper from '@/wrapper/ModalWrapper'

Follow the existing ModalWrapper behavior and styling conventions.

The following operations should use the appropriate modal:

* Add Bill
* Update Bill
* Mark Bill as Paid
* Enter custom payment method
* Any confirmation required for destructive actions

Avoid creating a separate modal component if the existing modal can handle the required behavior.

⸻

10. UI / Styling

Follow the existing application design system.

Use the colors defined in index.css:

@theme {
  --color-dark: #161B21;
  --color-medium-dark: #1D232C;
  --color-light-dark: #222730;
}

Use these theme colors through Tailwind classes rather than introducing unrelated colors.

General UI requirements

* Modern but consistent with the existing application.
* Minimal table borders.
* Good spacing.
* Clear visual hierarchy.
* Responsive on desktop, tablet, and mobile.
* Avoid excessive borders and unnecessary visual elements.
* Maintain the existing application’s dark theme.
* Inputs and buttons must follow existing component styles.
* Do not introduce gradients.
* Keep the UI consistent with the current software rather than creating a completely different design.

⸻

11. Table Design

Create a modern, clean table.

Example structure:

┌────────────────┬─────────┬────────────────────┬────────────┬────────────┬──────────────┐
│ Bill Name      │ Amount  │ Status             │ Due Date   │ Paid Date  │ Action       │
├────────────────┼─────────┼────────────────────┼────────────┼────────────┼──────────────┤
│ Internet       │ ₱1,500  │ Pending Payment    │ Oct 20     │ —          │ Update Delete│
│ Electricity    │ ₱2,300  │ Paid using BPI     │ Oct 15     │ Oct 14     │ Update Delete│
└────────────────┴─────────┴────────────────────┴────────────┴────────────┴──────────────┘

Status styling

Pending

Orange border
Orange text

Paid

Green border
Green text

Keep the status control compact and visually consistent with the rest of the application.

⸻

12. Component Requirements

Use existing components whenever available.

Input

import CustomInput from '@/components/inputs/CustomInputs'

Button

import SubmitButton from '@/components/button/SubmitButton'

Modal

import ModalWrapper from '@/wrapper/ModalWrapper'

Account Store

import { useAccountStore, useAmountHidden } from '@/store/useAccountStore'

Before creating new components, inspect the existing project to determine whether an equivalent component or utility already exists.

⸻

13. Data Handling

Follow the existing project’s data-fetching and persistence architecture.

Before implementing API/database operations:

1. Inspect the existing bill-related types/models.
2. Inspect existing hooks/services/API functions.
3. Inspect the database schema if available.
4. Reuse existing functions whenever possible.
5. If required functionality does not exist, implement it using the project’s existing conventions.

Do not introduce a new state-management or API pattern without a strong reason.

Ensure that:

* Create persists the bill.
* Update persists changes.
* Delete removes the correct bill.
* Payment status persists.
* Payment method persists.
* Custom Other payment methods persist.
* Paid date persists.
* UI state stays synchronized with persisted data.

⸻

14. Validation

Add appropriate validation.

At minimum:

* Bill Name must not be empty.
* Amount must be a valid positive number.
* Due Date must be valid.
* Payment method is required when marking a bill as paid.
* Custom payment method is required when Other is selected.
* Paid Date must be a valid date.

Display validation errors using the project’s existing error/validation patterns.

⸻

15. Error Handling

Handle failed operations gracefully.

For failed:

* Create
* Update
* Delete
* Payment/status update

Display an appropriate error message using the existing application notification/error pattern.

Do not silently fail.

⸻

16. Important Implementation Rules

* Modify the existing Bills.tsx instead of creating a completely separate Bills page.
* Reuse existing components and utilities.
* Reuse existing stores and hooks.
* Do not hardcode user accounts.
* Do not duplicate Create and Update forms.
* Do not introduce unnecessary dependencies.
* Follow the existing project coding style.
* Preserve existing functionality in Bills.tsx.
* Keep the implementation maintainable and readable.
* Use TypeScript types instead of any whenever possible.
* Avoid unnecessary useEffect, state, or duplicated logic.
* Keep business logic separate from UI logic where the existing architecture supports it.
* Make sure there are no TypeScript, ESLint, or build errors after implementation.

⸻

Acceptance Criteria

The implementation is complete when:

* Bills are displayed in a responsive table.
* User can click Add Bill.
* Add Bill opens ModalWrapper.
* User can create a bill.
* Newly created bills appear immediately.
* User can click Update.
* Update uses the same modal/form as Create.
* Existing bill data is populated when editing.
* User can successfully update a bill.
* User can click Delete.
* Delete requires confirmation.
* User can mark a bill as paid.
* Payment method/account can be selected.
* Other payment method is supported.
* Custom payment method can be entered.
* Paid Date defaults to the date the bill was marked as paid.
* User can manually edit Paid Date.
* Pending status uses orange styling.
* Paid status uses green styling.
* Account data comes from useAccountStore.
* useAmountHidden is respected for account amounts.
* Existing CustomInput, SubmitButton, and ModalWrapper components are used.
* UI follows the existing dark theme.
* Table has minimal borders and a modern appearance.
* Page works on different screen sizes.
* No unnecessary dependencies are added.
* No TypeScript/build errors are introduced.