import React from 'react';

interface DetailProps {
  label: string;
  children: React.ReactNode; // This ensures that the content passed as children is of any type
}

export const Detail: React.FC<DetailProps> = ({ label, children }) => (
  <div>
    <p className="label font-semibold">{label}</p>
    <p className="value">{children}</p>
  </div>
);
