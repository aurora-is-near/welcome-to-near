"use client";
import React, { useState } from "react";
import ManualNetworkConfiguration from "@/components/Modals/ManualNetworkConfiguration";
export default function ManualConfigurationTrigger() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <span
        className="mt-6 cursor-pointer px-4 text-center text-base font-semibold tracking-[0.28px] text-sand-12 underline decoration-dashed"
        onClick={() => setOpenModal(true)}
      >
        Have problems connecting a wallet ? Click here to get details for manual
        wallet configuration
      </span>
      <ManualNetworkConfiguration
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
