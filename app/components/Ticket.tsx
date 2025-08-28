import { Roboto_Mono } from "next/font/google";
import { useTicket } from "../TicketContext";
import TicketBarcode from "./TicketBarcode";
import moment from "moment";

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});


export default function Ticket() {
    const { data } = useTicket();

    return (
        <div className={`shadow-lg w-[760px] h-[300px] flex flex-col text-white text-[15px] ${robotoMono.className}`}>
            <div className=" bg-orange-400 h-[3rem] font-bold p-1 flex items-center">
                Some Brand
            </div>
            <div className="p-2 flex flex-1">
                <div className="w-[75px] flex items-center justify-center">
                    {data.barcode && (
                        <div className="rotate-270 text-black flex flex-col items-center w-[180px] over">
                            <TicketBarcode></TicketBarcode>
                        </div>
                    )}
                </div>
                <div className="px-1 flex flex-1 flex-col justify-between h-full text-white bg-gray-800">

                    <div>
                        <p className="text-[10px]">
                            {data.tour}
                        </p>{data.band}</div>
                    <div>
                        <div>{data.venue}</div>
                        <div className="whitespace-pre-line text-[10px]">{data.address}</div>
                    </div>
                    <div>{moment(data.datetime).format("dddd, DD. MMM YYYY, HH:mm")} Uhr</div>
                    <div>{data.seatType}</div>
                </div>

            </div>

        </div>
    );
}
