// src/components/forum/NewThreadForm.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createThread } from "@/app/actions/forumActions"; // Adjust path
import { useEffect, useRef } from "react";

interface NewThreadFormProps {
  categoryId: string;
}

// Submit Button Component (to use useFormStatus)
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition duration-150 ease-in-out ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {pending ? 'Creating...' : 'Create Thread'}
        </button>
    );
}

export default function NewThreadForm({ categoryId }: NewThreadFormProps) {
  const initialState = { status: 'idle', message: '', errors: null };
  const [state, formAction] = useFormState(createThread, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.status === 'success') {
      // Optionally show a success message before redirect (redirect happens server-side)
      console.log("Thread creation initiated successfully server-side.");
      // Redirect is handled by the server action itself
      // formRef.current?.reset(); // Reset form if needed (though redirect makes it less necessary)
    }
    if (state?.status === 'error') {
        // Display error messages to the user (e.g., using toasts)
        console.error("Form submission error:", state.message, state.errors);
        alert(`Error: ${state.message}`); // Basic alert fallback
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
       {/* Hidden input for categoryId */}
      <input type="hidden" name="categoryId" value={categoryId} />

      {/* Display general form errors */}
      {/* {state?.status === 'error' && !state.errors && (
           <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )} */}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Thread Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          minLength={5}
          maxLength={150}
          className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          aria-describedby="title-error"
        />
         {state?.errors?.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.title.join(', ')}</p>
         )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Your Message
        </label>
        {/* TODO: Replace textarea with a Rich Text Editor component */}
        <textarea
          id="content"
          name="content"
          rows={10}
          required
          minLength={10}
          maxLength={10000}
          className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          aria-describedby="content-error"
        ></textarea>
         {state?.errors?.content && (
            <p id="content-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.content.join(', ')}</p>
         )}
      </div>

      <div className="flex justify-end">
         <SubmitButton />
      </div>
    </form>
  );
}