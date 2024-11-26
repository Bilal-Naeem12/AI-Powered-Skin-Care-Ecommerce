const Button = ({ children, onClick, className, variant = "white" }) => {
  const baseClasses = `px-6 py-3 rounded-md transition duration-300 flex items-center gap-2 ${className}`;

  // Variant Styles
  const whiteVariant = `border border-white text-white hover:bg-white hover:text-gray-800`;
  const blackVariant = `border border-black text-black hover:bg-black hover:text-white`;
  const primaryVariant = `bg-blue-600 text-white hover:bg-blue-700`;
  const secondaryVariant = `bg-black text-white hover:bg-gray-700`;

  // Dynamically select variant styles
  const variantClasses = {
    white: whiteVariant,
    black: blackVariant,
    primary: primaryVariant,
    secondary: secondaryVariant,
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
