# AI Rules for IYF STUDIO Application

This document outlines the core technologies used in the IYF STUDIO application and provides clear guidelines for using specific libraries to maintain consistency and best practices.

## Tech Stack Overview

*   **Framework**: Next.js is used as the full-stack React framework, providing server-side rendering, routing, and API capabilities.
*   **Language**: TypeScript is employed throughout the codebase for type safety, improved code quality, and better developer experience.
*   **UI Components**: `shadcn/ui` provides a collection of accessible and customizable UI components, built on top of Radix UI primitives.
*   **Styling**: Tailwind CSS is the exclusive utility-first CSS framework for all styling, ensuring a consistent and efficient design system.
*   **Database & Authentication**: Supabase is utilized for database management, user authentication, and real-time functionalities.
*   **Payments**: Stripe is integrated for handling all payment processing and subscription management.
*   **Icons**: `lucide-react` is used for a comprehensive and consistent set of SVG icons across the application.
*   **Form Management**: `react-hook-form` is used for efficient form state management and validation, paired with `zod` for schema-based validation.
*   **Analytics**: Vercel Analytics is integrated for tracking application usage and performance.

## Library Usage Rules

To ensure maintainability, consistency, and optimal performance, please adhere to the following rules when developing:

*   **UI Components**:
    *   **Always** prioritize using components from `shadcn/ui` (`@/components/ui`).
    *   If a required component is not available in `shadcn/ui` or needs significant custom behavior, create a **new component** in `src/components/` that wraps or extends existing `Radix UI` primitives or other base HTML elements. **Do not modify `shadcn/ui` component files directly.**
*   **Styling**:
    *   **Exclusively** use Tailwind CSS classes for all styling. Avoid inline styles or custom CSS files, except for global styles defined in `app/globals.css`.
    *   Ensure designs are responsive by utilizing Tailwind's responsive utility classes.
*   **Database & Authentication**:
    *   All interactions with the database and user authentication must be performed using the Supabase client and server utilities provided in `@/lib/supabase/client` and `@/lib/supabase/server`.
    *   For server-side data fetching and mutations, leverage Next.js Server Actions in conjunction with Supabase.
*   **API Routes/Server Actions**:
    *   For any server-side logic, data fetching, or mutations, use Next.js Server Actions. Avoid creating traditional API routes (`/api`) unless absolutely necessary for specific third-party integrations that require them.
*   **Payments**:
    *   Stripe is the designated platform for all payment-related functionalities. Use `@stripe/react-stripe-js` for client-side UI integration and the `stripe` package (server-only) for secure backend operations.
*   **Icons**:
    *   All icons used in the application must come from the `lucide-react` library.
*   **Forms & Validation**:
    *   Implement all forms using `react-hook-form` for managing form state, submission, and validation.
    *   Use `zod` for defining validation schemas for all form inputs to ensure data integrity.
*   **Routing**:
    *   Utilize Next.js's file-system based routing for defining pages.
    *   For programmatic navigation, use `next/navigation` hooks and functions (e.g., `useRouter`).
*   **State Management**:
    *   For local component state, use React's `useState` and `useReducer` hooks.
    *   For global or shared state, prefer React Context API or simple prop drilling. Avoid introducing complex state management libraries unless the application's scale explicitly demands it.