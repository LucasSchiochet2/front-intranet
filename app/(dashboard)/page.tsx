import { Banners } from "../components/banners";
import { QuickAccess } from "../components/quick-access";
import { Birthdays } from "../components/birthdays";
import { UsefulLinks } from "../components/useful-links";
import { Calendar } from "../components/calendar";
import { News } from "../components/news";

export default function Home() {
  return (
    <div className="w-full max-w-[1000px] mx-auto overflow-y-auto px-4 md:px-0">
      <div className="space-y-6 pb-6">
        <Banners />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAccess />
          <Birthdays />
          <UsefulLinks />
          <Calendar />
          <div className="md:col-span-2 lg:col-span-2">
            <News />
          </div>
        </div>
      </div>
    </div>
  );
}
