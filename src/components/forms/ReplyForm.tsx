// src/components/forum/ReplyForm.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createPost } from "@/app/actions/forumActions"; // Adjust path
import { useEffect, useRef } from "react";

interface ReplyFormProps {
  threadId: string;
}

// Submit Button Component
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full sm:w-auto bg-green-600 text-white py-2 px-6 rounded font-semibold hover:bg-green-700 dark:hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition duration-150 ease-in-out ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {pending ? 'Posting...' : 'Post Reply'}
        </button>
    );
}

export default function ReplyForm({ threadId }: ReplyFormProps) {
  const initialState = { status: 'idle', message: '', errors: null };
  // Bind threadId to the action
  const createPostWithThreadId = createPost.bind(null);
  const [state, formAction] = useFormState(createPostWithThreadId, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state?.status === 'success') {
      // Reset the form on successful submission
      formRef.current?.reset();
      textAreaRef.current?.focus(); // Keep focus for quick multi-reply
      // Optionally show a success message (e.g., toast)
       alert("Reply posted successfully!"); // Basic alert fallback
       // Note: Revalidation happens server-side, page should update
    }
    if (state?.status === 'error') {
        // Display error messages
        console.error("Form submission error:", state.message, state.errors);
         alert(`Error: ${state.message}`); // Basic alert fallback
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
       {/* Hidden input for threadId */}
      <input type="hidden" name="threadId" value={threadId} />

       {/* Display general form errors */}
       {/* {state?.status === 'error' && !state.errors && (
           <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
       )} */}

      <div>
        <label htmlFor="reply-content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Your Reply
        </label>
        {/* TODO: Replace textarea with a Rich Text Editor component */}
        <textarea
          id="reply-content"
          name="content"
          ref={textAreaRef} // Ref for focus management
          rows={8}
          required
          minLength={10}
          maxLength={10000}
          className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          aria-describedby="reply-content-error"
        ></textarea>
         {state?.errors?.content && (
            <p id="reply-content-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{state.errors.content.join(', ')}</p>
         )}
      </div>

      <div className="flex justify-end">
         <SubmitButton />
      </div>
    </form>
  );
}