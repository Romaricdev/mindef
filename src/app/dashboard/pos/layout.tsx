export default function PosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // POS has its own full-screen layout, no dashboard wrapper needed
  return <>{children}</>
}
