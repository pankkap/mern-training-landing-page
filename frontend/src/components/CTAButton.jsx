function CTAButton({ label, onClick, variant = 'primary', className = '', type = 'button', disabled = false, icon }) {
  const styles =
    variant === 'secondary'
      ? 'border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-200 shadow-lg'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
    >
      {icon}
      {label}
    </button>
  )
}

export default CTAButton
