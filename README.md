# Angular Appointment Scheduler

A simple and responsive appointment scheduling application built with Angular and Firebase.

## Features

*   **Appointment Scheduling:** Create, Read, Update, and Delete (CRUD) appointments.
*   **Drag and Drop Rescheduling:** Easily reschedule appointments by dragging and dropping them on the calendar.
*   **Calendar View:**  Visual display of appointments using a calendar component.
*   **Responsive Design:** Works well on desktops, tablets, and mobile devices.
*   **Firebase Backend:** Uses Google Firebase for backend services (Firestore and Authentication).
*   **Angular Material UI:**  Modern and consistent user interface using Angular Material components.

## Technologies Used

*   **Frontend:**
    *   [Angular](https://angular.io/) -  A powerful JavaScript framework for building web applications.
    *   [Angular Material](https://material.angular.io/) - UI component library for Angular.
    *   [FullCalendar Angular](https://fullcalendar.io/angular) - JavaScript calendar library for Angular.
    *   [RxJS](https://rxjs.dev/) - Reactive Extensions Library for JavaScript.
    *   [TypeScript](https://www.typescriptlang.org/) -  Superset of JavaScript that adds static typing.
*   **Backend & Infrastructure:**
    *   [Firebase](https://firebase.google.com/) - Backend-as-a-Service (BaaS) platform.
        *   [Firestore](https://firebase.google.com/docs/firestore) - NoSQL cloud database.
        *   [Firebase Authentication](https://firebase.google.com/docs/auth) - User authentication service.

## Setup Instructions

1.  **Download the Repository:**

    Clone the repository to your local machine using Git:

    ```bash
    git clone https://github.com/Michael-ctrl-eng/Angular-Appointment-Scheduler.git
    cd Angular-Appointment-Scheduler
    ```

2.  **Install Dependencies:**

    Navigate to the project directory in your terminal and install the required Node.js packages using npm:

    ```bash
    npm install
    ```

3.  **Firebase Configuration:**

    *   **Create a Firebase Project:** If you don't have one already, create a new project in the [Firebase Console](https://console.firebase.google.com/).
    *   **Enable Firestore and Authentication:** In your Firebase project, enable Firestore database and Authentication (choose your preferred authentication methods, e.g., Email/Password).
    *   **Get Firebase Configuration:** Go to Project settings > General > Web apps > Add app (</>). Register your app and copy the Firebase configuration object.
    *   **Update Environment Files:** In the `Angular-Appointment-Scheduler` project, navigate to `src/environments/`.
        *   Replace the placeholder values in `environment.ts` and `environment.prod.ts` with your Firebase configuration object.

        ```typescript
        // environment.ts (example)
        export const environment = {
          production: false,
          firebaseConfig: {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_AUTH_DOMAIN",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_STORAGE_BUCKET",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID",
            measurementId: "YOUR_MEASUREMENT_ID"
          }
        };
        ```

4.  **Environment Setup (Optional):**

    If you need to configure any environment variables (e.g., API endpoints, specific settings), you can modify the `environment.ts` and `environment.prod.ts` files in `src/environments/`.

## Running the Application

1.  **Start Development Server:**

    To run the application in development mode with live reload, use the Angular CLI serve command:

    ```bash
    ng serve
    ```

    Open your browser and navigate to `http://localhost:4200/`. The application should be running.

2.  **Build for Production:**

    To build the application for production deployment, use the Angular CLI build command:

    ```bash
    ng build --prod
    ```

    The production build will be located in the `dist/angular-appointment-scheduler` directory. You can then deploy these files to a web server or Firebase Hosting (see Deployment instructions below).

## VS Code Setup (Recommended Extensions & Settings)

For an optimal development experience, it is recommended to use VS Code with the following extensions and settings:

**Recommended Extensions:**

*   **[Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template):** Provides rich editing experience for Angular templates.
*   **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint):** Integrates ESLint for code linting and error detection.
*   **[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode):**  Formats your code to maintain consistent style.
*   **[Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme):**  Enhances VS Code's file icons for better visual organization.
*   **[GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens):**  Provides powerful Git features within VS Code.

**VS Code Settings (settings.json):**

You can configure VS Code to automatically format your code on save and enable ESLint validation. Open VS Code settings (`Ctrl + ,` or `Cmd + ,`) and click on the "Open Settings (JSON)" icon in the top-right corner. Add or modify the following settings in your `settings.json` file:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "html"
  ],
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
