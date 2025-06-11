import React from "react";
import { Search, Bookmark } from "lucide-react";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="hidden md:flex fixed md:top-0 md:left-0 md:right-0 md:z-20 items-center bg-white h-16 border-b border-[#27272a] px-4 justify-between cursor-pointer">
      <div className="flex items-center text-[#52525b] text-[14px] gap-2" onClick={() => navigate("/")}>
        <svg
        width="12"
        height="14"
        viewBox="0 0 12 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6 0.333344H0V4.77778V9.22224H6V13.6667H12V9.22224V4.77778H6V0.333344Z"
          fill="#121417"
        />
      </svg>
      <span className="font-medium">Git Explorer</span>
    </div>
    <div className="flex items-center gap-2" onClick={() => navigate("/favorites")}>
      <div className="bg-[#F0F2F5] border-none rounded-[6px] w-10 h-10 flex items-center justify-center cursor-pointer mr-2">
        <svg
          width="14"
          height="19"
          viewBox="0 0 14 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.25 0H1.75C0.921573 0 0.25 0.671573 0.25 1.5V18C0.250136 18.2726 0.398147 18.5236 0.636587 18.6557C0.875028 18.7878 1.16636 18.7801 1.3975 18.6356L7 15.1341L12.6034 18.6356C12.8345 18.7796 13.1255 18.787 13.3636 18.655C13.6018 18.523 13.7497 18.2723 13.75 18V1.5C13.75 0.671573 13.0784 0 12.25 0V0ZM12.25 16.6472L7.39656 13.6144C7.15336 13.4624 6.84477 13.4624 6.60156 13.6144L1.75 16.6472V1.5H12.25V16.6472Z"
            fill="#121417"
          />
        </svg>
      </div>
    </div>
    </div>
  );
};

const MobileHeader = () => (
  <div className="flex md:hidden fixed top-0 left-0 right-0 z-20 items-center gap-2 justify-center bg-white h-12 border-b border-[#27272a] px-4">
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 0.333344H0V4.77778V9.22224H6V13.6667H12V9.22224V4.77778H6V0.333344Z"
        fill="#121417"
      />
    </svg>
    <span className="text-[#52525b] text-[14px] font-medium">Git Explorer</span>
  </div>
);

const MobileFooter = () => {
  const navigate = useNavigate();
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-[#e4e4e7] flex justify-around items-center h-16 md:hidden">
      <div
        className="flex flex-col items-center justify-center text-xs text-[#27272a] transition-colors duration-150 hover:text-[#6366f1] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Search className="w-6 h-6 mb-1" />
        <span>Search</span>
      </div>
      <div
        className="flex flex-col items-center justify-center text-xs text-[#27272a] transition-colors duration-150 hover:text-[#6366f1] cursor-pointer"
        onClick={() => navigate("/favorites")}
      >
        <Bookmark className="w-6 h-6 mb-1" />
        <span>Saved</span>
      </div>
    </footer>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <MobileHeader />
      <main className="min-h-svh w-screen pt-10 md:pt-16 pb-16 md:pb-0">
        {children}
      </main>
      <MobileFooter />
    </div>
  );
};

export default Layout;
