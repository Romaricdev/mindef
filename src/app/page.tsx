import { redirect } from 'next/navigation'

// Redirect root to public home page
export default function RootPage() {
  redirect('/home')
}
