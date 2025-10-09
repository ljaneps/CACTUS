
export function ButtonComponent({
  text,
  icon: Icon,
  onClick,
  variant = "primary",
}) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200";
  const variants = {
    primary: "text-white bg-primary hover:bg-primary-medium",
    secondary: "text-primary border border-primary hover:bg-primary-light",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      {text}
      {Icon && <Icon className="w-4 h-4 ml-2" />}
    </button>
  );
}
