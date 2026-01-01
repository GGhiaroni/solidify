"use client";

import { useState, useTransition } from "react";

export default function DeleteJourneyButton() {
  const [isPending, startTransition] = useTransition();
  const [open, setIsOpen] = useState(false);
  return <div>DeleteJourneyButton</div>;
}
