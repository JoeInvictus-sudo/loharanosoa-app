"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddStudentModal from "./AddStudentModal";

export default function AddStudentButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "12px 22px",
          background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 6px 16px rgba(79,70,229,0.25)",
          transition: "all 0.2s",
          fontFamily: "inherit",
        }}
      >
        + Nouvel élève
      </button>

      {isOpen && <AddStudentModal onClose={() => setIsOpen(false)} />}
    </>
  );
}