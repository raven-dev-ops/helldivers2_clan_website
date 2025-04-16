// src/lib/types.ts

// Example: Shared TypeScript type definitions

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role?: string;
  }
  
  export interface ForumCategory {
    id: string;
    name: string;
    description?: string;
  }
  
  export interface ForumThread {
    id: string;
    categoryId: string;
    title: string;
    createdAt: string;
    authorId: string;
  }
  
  export interface ForumPost {
    id: string;
    threadId: string;
    content: string;
    authorId: string;
    createdAt: string;
  }
  