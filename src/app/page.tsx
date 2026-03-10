import { redirect } from 'next/navigation';

// Root page: redirect to home landing page
export default function RootPage() {
  redirect('/home');
}
