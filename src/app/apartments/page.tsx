import { getApartmentData } from "@/lib/data/apartments";
import ApartmentsContent from "@/components/ApartmentsContent";

export default async function ApartmentsPage() {
  const apartment = await getApartmentData();

  return <ApartmentsContent apartment={apartment} />;
}
