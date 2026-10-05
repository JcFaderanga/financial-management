Update login page
update page adding username and password fields

Code settings:
- Use 4 tab spacing
- Use consistent indentation

Modifications for fuctions:
- Add username and password input fields to the login page.
- Include a submit button for the login form.
- User form for handling login submission.
- Keep the existing Google sign-in and demo account options.
- Add forgot password link below the password input field but redirection in blank for now.

Modifications for UI:
- Remove the gradient background and replace it with a clean, simple background.
- Ensure proper styling and layout for the new input fields.
- Remove description text and replace it with a simple welcome message.
- For Input fields, use import CustomInput from '@/components/inputs/CustomInputs'
- For Button, use import SubmitButton from '@/components/button/SubmitButton'
- Make sure the page is responsive and looks good on different screen sizes.
- Make the form centered on the page with appropriate spacing between elements.
- Follow color theme in index.css 
  @theme {
  --color-dark:#161B21 ;
  --color-medium-dark: #1D232C;
  --color-light-dark: #222730;
}
- Use theme in className for dark mode support.

Username input field:
- Label: "Username"
- Type: "Email"
- Placeholder: "Enter your email address"

Password input field:
- Label: "Password"
- Type: "password"
- Placeholder: "Enter your password"
- Create an show password toggle button to show/hide the password input.


============================ Session 2 =======================================
On more page
add a update password field 

New Fuctions:
- Create a update/Create password field
- User must be able to update their passoword

Modifications for UI:
- Remove the gradient background and replace it with a clean, simple background.
- Ensure proper styling and layout for the new input fields.
- Remove description text and replace it with a simple welcome message.
- For Input fields, use import CustomInput from '@/components/inputs/CustomInputs'
- For Button, use import SubmitButton from '@/components/button/SubmitButton'
- Make sure the page is responsive and looks good on different screen sizes.
- Make the form centered on the page with appropriate spacing between elements.
- Follow color theme in index.css 
  @theme {
  --color-dark:#161B21 ;
  --color-medium-dark: #1D232C;
  --color-light-dark: #222730;
}
- Use theme in className for dark mode support.

Username input field:
- Label: "Username"
- Type: "Email"
- Placeholder: "Enter your email address"

Password input field:
- Label: "Password"
- Type: "password"
- Placeholder: "Enter your password"
- Create an show password toggle button to show/hide the password input.

============================ Session 3 =======================================
Create a Forget password page

New Fuctions:
- Create new page for forgot password
- Create a update/Create password field
- User must be able to update their passoword
- Must need to verify first if the username/email exist on database
- If username/email not found display error message that user name it not registered or exist
- If username/email exist thats the time password field and verify password field will be displyed
- Add a back button to login page when user is on forgot password page

Modifications for UI:
- Ensure proper styling and layout for the new input fields.
- For Input fields, use import CustomInput from '@/components/inputs/CustomInputs'
- For Button, use import SubmitButton from '@/components/button/SubmitButton'
- Make sure the page is responsive and looks good on different screen sizes.
- Make the form centered on the page with appropriate spacing between elements.
- Follow color theme in index.css 
  @theme {
  --color-dark:#161B21 ;
  --color-medium-dark: #1D232C;
  --color-light-dark: #222730;
}
- Use theme in className for dark mode support.

Username input field:
- Label: "Username"
- Type: "Email"
- Placeholder: "Enter your email address"

Password input field:
- Label: "Password"
- Type: "password"
- Placeholder: "Enter your password"
- Create an show password toggle button to show/hide the password input.