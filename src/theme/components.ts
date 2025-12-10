// Component Design Tokens & Variants

export const buttonVariants = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-4 focus:ring-primary/30",
    secondary: "bg-indigo-100 text-indigo-900 hover:bg-indigo-200",
    outline: "border border-primary text-primary bg-transparent hover:bg-primary-light",
    danger: "bg-destructive text-white hover:bg-red-700",
    muted: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
};

export const inputVariants = {
    default: "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/30",
    error: "bg-red-50 border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-200",
};

export const badgeVariants = {
    active: "bg-success text-success-text border-success-border",
    pending: "bg-warning text-warning-text border-warning-border",
    error: "bg-error text-error-text border-error-border",
    draft: "bg-gray-100 text-gray-600 border-gray-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
};

export const alertVariants = {
    success: "bg-success border-success-border text-success-text",
    warning: "bg-warning border-warning-border text-warning-text",
    error: "bg-error border-error-border text-error-text",
    info: "bg-info-light border-blue-200 text-blue-800",
};

export const cardVariants = {
    default: "bg-card border border-border shadow-sm rounded-lg",
    hover: "hover:shadow-md transition-shadow duration-200",
};
