// src/app/admin/users/page.tsx

export const metadata = {
  title: 'Admin Users',
};

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <p>
        Search, view, or edit user data. You could also manage user roles here.
      </p>
    </div>
  );
}
