# Admin Dashboard

This project is an admin dashboard built using the BlazeUI CSS framework, featuring a responsive layout with a sidebar, user table, and dynamic functionalities like adding, editing, and deleting users. The app uses jQuery for DOM manipulation, event handling, and dynamic updates, with all user data stored in the browser's local storage.

## Features

1. **Page Layout**:

   - A responsive layout with a header, sidebar menu, and main content area.
   - The sidebar includes non-functional links like "Dashboard," "Reports," and "Settings."

2. **User Table**:

   - A paginated table displaying users with the following columns: Name, Email, Role, and Actions (Edit/Delete).
   - Table data is fetched and stored in the browser's local storage.
   - Users are displayed with basic pagination.

3. **Functionalities**:

   - **Search**: A search bar above the table to filter users by name or email in real-time.
   - **Add User**: Modal form to add a new user with fields for Name, Email, and Role. The new user is added to the table and saved in local storage.
   - **Edit User**: Clicking "Edit" opens a modal pre-filled with the selected user's details, allowing for modification. Changes are saved to the table and local storage.
   - **Delete User**: A confirmation dialog appears before deleting a user. Upon confirmation, the user is removed from the table and local storage.

4. **UI and Styling**:

   - Uses BlazeUI components and classes for the table, buttons, modals, and layout.
   - Clean and professional look using BlazeUI utilities and predefined styles.

5. **Dynamic Elements**:
   - Client-side validation is implemented for the add/edit user forms to ensure all required fields are filled out correctly.

## Bonus Features (Optional)

- **Dropdown Filter**: Users can filter by role (e.g., Admin, Editor, Viewer).
- **Collapsible Sidebar**: The sidebar can be collapsed with an animation effect.
- **Loading Spinner**: A loading spinner or skeleton screen appears during page load for better user experience.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/TigranPetrosyan707/admin-dashboard.git
   cd admin-dashboard
   ```
2. Open index.html in your browser
