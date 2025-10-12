export function ButtonComponent({
  text,
  icon: Icon,
  disabled = false,
  onClick,
  variant = "primary",
  fullWidth = false,
  size = "md",
  loading = false,
}) {
  const base =
    "inline-flex items-center justify-center rounded-md transition-all duration-200 font-medium";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variants = {
    primary: "text-white bg-primary hover:bg-primary-medium disabled:opacity-50",
    secondary: "text-primary border border-primary hover:bg-primary-light disabled:opacity-50",
  };

  const widthClass = fullWidth ? "w-full" : "inline-flex";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${widthClass}`}
    >
      {loading ? "Loading..." : text}
      {!loading && Icon && <Icon className="w-4 h-4 ml-2" />}
    </button>
  );
}

