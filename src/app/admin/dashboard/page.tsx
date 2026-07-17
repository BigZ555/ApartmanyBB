import { redirect } from "next/navigation";
import { isAdmin, getApartmentData, getSettings } from "@/lib/data/apartments";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminDashboardPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/admin");

  const apartment = await getApartmentData();
  const settings = await getSettings();

  return <AdminDashboard apartment={apartment} settings={settings} />;
}
