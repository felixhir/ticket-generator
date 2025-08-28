"use client";

import { useState } from "react";
import Ticket from "./components/Ticket";
import Sidebar from "./components/Sidebar";



export default function Home() {
  const [ticketData, setTicketData] = useState({
    tour: "",
    band: "",
    venue: "",
    address: "",
    datetime: "",
    seatType: "",
    barcode: "My Event",
  });

  return (
    <div className="flex h-screen">
      {/* Hauptbereich mit Ticket */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 px-4">
        <Ticket data={ticketData} />
      </div>

      {/* Sidebar */}
      <Sidebar data={ticketData} setData={setTicketData} />
    </div>
  );
}
