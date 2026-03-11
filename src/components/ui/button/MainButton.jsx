import React from "react";
import Text from "../typography/Text";

export default function MainButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-primary p-3 rounded-full hover:cursor-pointer ${className}`}
    >
      <Text className="text-background">{children}</Text>
    </button>
  );
}