import DatePicker from "react-datepicker";
import { useTicket } from "../TicketContext";

export default function Sidebar() {
    const { data, setData } = useTicket();

    return (
        <div className="w-64 bg-gray-200 border-l p-4 flex flex-col text-black space-y-4 overflow-y-auto">
            <label className="flex flex-col">
                <span>Tour</span>
                <input
                    type="text"
                    value={data.tour}
                    onChange={(e) => setData({ tour: e.target.value })}
                    className="border p-1"
                />
            </label>

            <label className="flex flex-col">
                <span>Band</span>
                <input
                    type="text"
                    value={data.band}
                    onChange={(e) => setData({ band: e.target.value })}
                    className="border p-1"
                />
            </label>

            <label className="flex flex-col">
                <span>Venue</span>
                <input
                    type="text"
                    value={data.venue}
                    onChange={(e) => setData({ venue: e.target.value })}
                    className="border p-1"
                />
            </label>

            <label className="flex flex-col">
                <span>Address</span>
                <textarea
                    rows={2}
                    value={data.address}
                    onChange={(e) => setData({ address: e.target.value })}
                    className="border p-1 resize-none"
                />
            </label>

            <label className="flex flex-col">
                <span>Time</span>
                <DatePicker className="border p-1" showTimeInput={true} selected={data.datetime} onChange={(date) => setData({ datetime: date })}></DatePicker>
            </label>

            <label className="flex flex-col">
                <span>Area</span>
                <input
                    type="text"
                    value={data.seatType}
                    onChange={(e) => setData({ seatType: e.target.value })}
                    className="border p-1"
                />
            </label>

            <label>
                <span>Barcode</span>
                <input
                    type="text"
                    value={data.barcode || ""}
                    onChange={(e) => setData({ barcode: e.target.value })}
                    className="w-full border p-1 rounded"
                />
            </label>

        </div>
    );
}
