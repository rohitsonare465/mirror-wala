import { redirect } from 'next/navigation';

export default function AdminBasePage() {
  // Redirect directly to the dashboard
  redirect('/admin/dashboard');
}
