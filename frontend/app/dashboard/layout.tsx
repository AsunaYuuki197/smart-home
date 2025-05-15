import AppLayout from "../components/AppLayout"; // Import AppLayout tại đây
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppLayout>{children}</AppLayout> 
    </div>
  );
}   