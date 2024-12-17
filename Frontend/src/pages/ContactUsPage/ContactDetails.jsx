import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactDetails = () => {
  const details = [
    {
      title: "Contact Directly",
      items: [
        { icon: <EmailIcon />, text: "info@skincare.com" },
        { icon: <PhoneIcon />, text: "+92 315-755-723" },
      ],
    },
    {
      title: "Customer Service",
      items: [
        { icon: <EmailIcon />, text: "support@skincare.com" },
        { icon: <PhoneIcon />, text: "+92 42-111-746-756" },
      ],
    },
    {
      title: "Head Quarter",
      items: [
        {
          text: "Office 1 Ground Floor Al Hafeez View 67 D1 Sir Syed Rd Gulberg III Lahore, Pakistan",
        },
      ],
    },
    {
      title: "Ceo Direct Complain",
      items: [{ text: "ceo@skincare.com" }],
    },
    {
      title: "Work With Us",
      items: [{ text: "jobs@skincare.com" }],
    },
    {
      title: "Corporate Support",
      items: [{ text: "corporate@skincare.com" }],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {details.map((detail, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-sm">
          <h3 className="font-bold mb-2">{detail.title}</h3>
          {detail.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 mb-1">
              {item.icon && <span className="text-black">{item.icon}</span>}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ContactDetails;
