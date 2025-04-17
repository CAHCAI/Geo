import CA_LOGO from "@/assets/ca-logo-color.svg";
import ThemeToggle from "../ThemeToggle";

const TopNavBar = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex items-center gap-3 justify-between dark:bg-black bg-white">
      <div>
        <img
          src={CA_LOGO}
          alt="Geo Logo"
          className="h-5 sm:h-6 object-contain cursor-pointer"
        />
      </div>
      <ul className="flex items-center gap-5 text-sm">
        <li className="group cursor-pointer hover:text-blue-500 text-blue-900 dark:text-white dark:hover:text-blue-500 transition-all duration-200 ease-linear">
          <a href="https://hcai.ca.gov/media-center/">
            <p className="py-2">Newsroom</p>
            <div className="w-0 group-hover:w-full transition-all duration-200 ease-linear h-[.1rem] bg-blue-500 opacity-0 group-hover:opacity-100"></div>
          </a>
        </li>
        <li className="group cursor-pointer hover:text-blue-500 text-blue-900 dark:text-white dark:hover:text-blue-500 transition-all duration-200 ease-linear">
          <a href="https://hcai.ca.gov/public-meetings/">
            <p className="py-2">Public Meetings</p>
            <div className="w-0 group-hover:w-full transition-all duration-200 ease-linear h-[.1rem] bg-blue-500 opacity-0 group-hover:opacity-100"></div>
          </a>
        </li>
        <li className="group cursor-pointer hover:text-blue-500 text-blue-900 dark:text-white dark:hover:text-blue-500 transition-all duration-200 ease-linear">
          <a href="https://hcai.ca.gov/about/">
            <p className="py-2">About HCAI</p>
            <div className="w-0 group-hover:w-full transition-all duration-200 ease-linear h-[.1rem] bg-blue-500 opacity-0 group-hover:opacity-100"></div>
          </a>
        </li>
        <li className="group cursor-pointer hover:text-blue-500 text-blue-900 dark:text-white dark:hover:text-blue-500 transition-all duration-200 ease-linear">
          <a href="https://hcai.ca.gov/mailing-list/">
            <p className="py-2">Subscribe</p>
            <div className="w-0 group-hover:w-full transition-all duration-200 ease-linear h-[.1rem] bg-blue-500 opacity-0 group-hover:opacity-100"></div>
          </a>
        </li>
        <li className="border rounded-3xl px-3 py-1 font-bold text-blue-700 border-blue-600 dark:border-white dark:text-white cursor-pointer hover:bg-blue-600 hover:text-white transition-all duration-200 ease-linear">
          <a href="https://hcai.ca.gov/login/">LOG IN</a>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </div>
  );
};

export default TopNavBar;
