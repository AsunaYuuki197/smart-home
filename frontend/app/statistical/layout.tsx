import AppLayout from "../components/AppLayout"; // Import AppLayout tại đây

export default function StatisicalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppLayout>{children}</AppLayout> {/* AppLayout chỉ được dùng ở đây */}
    </div>
  );
}   