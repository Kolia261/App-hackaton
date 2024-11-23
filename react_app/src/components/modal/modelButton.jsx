import React from "react";
import { useModal } from "../../context/ModalContext";

export default function ModalButton({ children, ...props }) {
  const { handleOpen } = useModal();

  return (
    <button onClick={handleOpen} {...props}>
      {children}
    </button>
  );
}
