# Link App

A simple app to store and share your links.

## Features

- **User Authentication**: Secure login and registration.
- **Store Links**: Save and manage your favorite links.
- **Edit Links**: Update your stored links easily.
- **Share Links**: Share links directly from the app.
- **Delete Links**: Remove links when no longer needed.
- **Responsive Design**: Works seamlessly on all device sizes.

## Roadmap

- [x] Add user authentication
- [x] Add link storage
- [x] Add link editing
- [x] Add link deletion
- [ ] Add link sharing
- [ ] Add link dragging

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Typescript
- **Backend**: Supabase
- **Icons**: Phosphor Icons
- **UI Components**: ShadcnUI, AcceternityUI
- **Package Manager**: pnpm

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- **Node.js**: Make sure Node.js is installed. [Download here](https://nodejs.org/).
- **pnpm**: Install pnpm if you haven't already:

  ```bash
  npm install -g pnpm
  ```

### Cloning the Repository

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/princeeze/link-app.git
   ```

2. Navigate to the project directory:

```bash
cd link-app
```

### Setting Up Supabase

1. Create a new project on [Supabase](https://supabase.com/).
2. Grab your API keys from the Supabase dashboard.
3. Copy the `.env` file in the root directory of your project to a `.env.local` file and add the environment variables

### Run the Project

```bash
pnpm i
pnpm dev
```

## License

This project is licensed under the MIT License
