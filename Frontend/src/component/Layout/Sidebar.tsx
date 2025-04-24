import React, { useState,useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import UserImage from "@/assets/avatar-default.png";
import { SidebarSection } from "@/data/profileSidebarOptions";
import { ChevronRight, ChevronLeft, ChevronDown, LogOut } from "lucide-react";
import useUserStore from "@/store/useUserStore";

interface SidebarProps {
  sidebarOptions: SidebarSection[];  // Receive sections as a prop
}

const SidebarComponent: React.FC<SidebarProps> = ({ sidebarOptions }) => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar
  const [isProfileExpanded, setIsProfileExpanded] = useState(false); // State to toggle profile section
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({}); // State for expanded sections
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // Hook to navigate programmatically
  const {user}  = useUserStore()
    // Function to toggle expanded section
  const toggleSection = (sectionName: string) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [sectionName]: !prevState[sectionName],
    }));
  };
  
  return (
    <div   className={`absolute top-16  z-50 sm:top-0 sm:relative flex border shadow-xl rounded transition-all duration-300 ease-in-out `}>
      {/* Sidebar */}
      <aside
        className={`top-0 left-0 bg-white text-secondary transition-all duration-300 ease-in-out ${
          isOpen ? "w-60" : "w-0 md:w-20"
        }`}
      >
        {/* Profile Section */}
        <div className="">
          <div
            className="flex flex-col items-center justify-center mt-4 cursor-pointer"
            onClick={() =>{ setIsProfileExpanded(!isProfileExpanded);}}
          >
            <div className={`w-16 h-16 ${isOpen?"visible":" opacity-0 md:opacity-100"}   transition-all  rounded-full shadow-md border-4 border-white overflow-hidden`}>
              <img
                src={UserImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isOpen && (
              <div className="ml-3 flex text-primary">
                <h3 className="text-lg font-semibold">{user?.first_name} {user?.last_name}</h3>
                <ChevronDown
                  size={20}
                  className={`transition-transform mt-1 ${
                    isProfileExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            )}
          </div>

          {/* Collapsible Profile Options */}
          {isProfileExpanded && isOpen && (
            <ul className="mt-2 pl-6">
              {sidebarOptions[0].options.map((item, index) => (
                <li key={index} className="py-2"  >
                  <Link
                    to={item.path}
                    className="flex items-center space-x-2 text-sm text-secondary hover:text-primary"
                  >
                    {item.icon && <item.icon size={18} />}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation Links */}
        <ul className={`mt-4 border-y border-[#ffffff79] ${isOpen?"visible":" opacity-0 md:opacity-100"}  transition-all delay-300 ease-in-out`}>
          {sidebarOptions.slice(1).map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Section Title */}
              {isOpen && (
                <li className="px-4 py-2 text-lg border-y-2 font-semibold mt-3 text-primary">
                  {section.section}
                </li>
              )}
              {section.options.map((item, index) => (
                <div key={index}>
                  <li
                    className={`border-b border-[#ffffff79] ${
                      index === section.options.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        isOpen ? "justify-start space-x-4" : "justify-center"
                      } p-3 text-sm transition-all duration-500 ease-in-out cursor-pointer ${
                        location.pathname === item.path
                          ? "bg-white text-primary"
                          : "hover:bg-black hover:text-white"
                      }`}
                      onClick={() =>{
                      
                        item.subOptions
                          ? toggleSection(item.name)
                          : navigate(item.path); // Navigate directly if no sub-options
                        
                        
                        }                      }
                    >
                      {item.icon && <item.icon size={20} />}
                      {isOpen && <span>{item.name}</span>}
                      {item.subOptions && isOpen && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            expandedSections[item.name] ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </li>

                  {/* Render Sub-Options if expanded */}
                  {item.subOptions &&
                    expandedSections[item.name] &&
                    isOpen && (
                      <ul className="pl-8">
                        {item.subOptions.map((subItem, subIndex) => (
                          <li key={subIndex} className="py-1">
                            <Link
                              to={subItem.path}
                              className={`text-sm text-secondary hover:text-primary ${
                                location.pathname === subItem.path
                                  ? "text-primary font-semibold"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center justify-start gap-3 border-b pb-3">
                                <ChevronRight size={15} /> {/* Render icon if available */}
                                <span>{subItem.name}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          ))}
        </ul>

        {/* Logout Section */}
        <div className="bottom-4 w-full">
          <Link
            to="/"
            className={`flex items-center ${
              isOpen ? "justify-start space-x-4" : "justify-center"
            } p-3 text-sm transition hover:bg-white hover:text-primary`}
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </Link>
        </div>
      </aside>
   
      {/* Toggle Button */}
      <button
        className={`fixed top-20 transition-all duration-300 ease-in-out ${
          isOpen ? "left-[220px]" : "left-0 md:left-16"
        } z-50 bg-white text-primary p-1 rounded-md shadow-md`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft size={30} /> : <ChevronRight size={30} />}
      </button>
    </div>
  );
};

export default SidebarComponent;