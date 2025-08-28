"use client";

import Ticket from "./components/Ticket";
import Sidebar from "./components/Sidebar";
import { TicketProvider } from "./TicketContext";



export default function Home() {
  return (
    <TicketProvider>
      <div className="flex h-screen">
        {/* Hauptbereich mit Ticket */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 px-4">
          <Ticket />
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </TicketProvider>
  );
}
