import React from "react";

const Breadcrumb = ({ paths }: { paths: { name: string; link: string }[] }) => {
  return (
    <nav className="text-lg text-gray-600">
      {paths.map((path, index) => (
        <span key={index}>
          <a
            href={path.link}
            className={`hover:text-black ${
              index !== paths.length - 1 ? "mr-2" : ""
            }`}
          >
            {path.name}
          </a>
          {index !== paths.length - 1 && <span className="mx-2">›</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
