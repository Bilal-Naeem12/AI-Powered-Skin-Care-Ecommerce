const Button = ({ children, onClick, className, variant = "white" }) => {
  const baseClasses = `px-6 py-3 rounded-md transition duration-300 flex items-center gap-2 ${className}`;
  const whiteVariant = `border border-white text-white hover:bg-white hover:text-gray-800`;
  const blackVariant = `border border-black text-black hover:bg-black hover:text-white`;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${
        variant === "white" ? whiteVariant : blackVariant
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
