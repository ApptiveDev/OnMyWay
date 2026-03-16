function DarkModeButton({ toggle }) {
  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full flex items-center
       justify-center"
    >
      🌙
    </button>
  );
}

export default DarkModeButton;