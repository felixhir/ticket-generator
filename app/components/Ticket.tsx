import { Roboto_Mono } from "next/font/google";
import Barcode from "react-barcode";
import { createContext, useContext, useState } from "react";

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});

interface TicketProps {
    data: {
        tour: string;
        band: string;
        venue: string;
        address: string;
        datetime: string;
        seatType: string;
        barcode: string;
    };
}

export default function Ticket({ data }: TicketProps) {
    return (
        <div className={`shadow-lg w-[760px] h-[300px] flex flex-col text-white ${robotoMono.className}`}>
            <div className=" bg-orange-400 h-[3rem] font-bold p-1 flex items-center">
                Some Brand
            </div>
            <div className="p-2 flex flex-1">
                <div className="w-[75px] flex items-center justify-center">
                    {data.barcode && (
                        <div className="rotate-270 text-black flex flex-col items-center w-[180px] over">
                            <Barcode
                                value={data.barcode}
                                height={30}
                                displayValue={false}
                                width={1.2}
                                lineColor="#000000"
                                background=""
                                renderer="svg"
                                className="-m-2.5"
                            />
                            <p className="z-10 text-xs truncate">{data.barcode}</p>
                        </div>
                    )}
                </div>
                <div className="px-1 flex flex-1 flex-col justify-between h-full text-white bg-gray-800">
                    <div className="">{data.band || "Bandname"}</div>
                    <div>
                        <div>{data.venue || "Veranstaltungsort"}</div>
                        <div className="whitespace-pre-line">{data.address || "Adresse"}</div>
                    </div>
                    <div>{data.datetime || "Datum & Uhrzeit"}</div>
                    <div>{data.seatType || "Art des Platzes"}</div>
                </div>

            </div>

        </div>
    );
}
