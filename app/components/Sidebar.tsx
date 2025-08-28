interface SidebarProps {
    data: {
        tour: string;
        band: string;
        venue: string;
        address: string;
        datetime: string;
        seatType: string;
        barcode: string;
    };
    setData: (data: any) => void;
}

export default function Sidebar({ data, setData }: SidebarProps) {
    const handleChange = (field: string, value: string) => {
        setData({ ...data, [field]: value });
    };

    return (
        <div className="w-64 bg-gray-200 border-l p-4 flex flex-col text-black space-y-4 overflow-y-auto">
            <label className="flex flex-col">
                <span>Tourname</span>
                <input
                    type="text"
                    value={data.tour}
                    onChange={(e) => handleChange("tour", e.target.value)}
                    className="border p-1"
                />
            </label>

            <label className="flex flex-col">
                <span>Bandname</span>
                <input
                    type="text"
                    value={data.band}
                    onChange={(e) => handleChange("band", e.target.value)}
                    className="border p-1"
                />
            </label>

            <label className="flex flex-col">
                <span>Veranstaltungsort</span>
                <input
                    type="text"
                    value={data.venue}
                    onChange={(e) => handleChange("venue", e.target.value)}
                    className="border p-1"
                />
            </label>

            <label className="flex flex-col">
                <span>Adresse (2 Zeilen möglich)</span>
                <textarea
                    rows={2}
                    value={data.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="border p-1 resize-none"
                />
            </label>

            <label className="flex flex-col">
                <span>Datum & Uhrzeit</span>
                <input
                    type="text"
                    value={data.datetime}
                    onChange={(e) => handleChange("datetime", e.target.value)}
                    className="border p-1"
                />
            </label>

            <label className="flex flex-col">
                <span>Art des Platzes</span>
                <input
                    type="text"
                    value={data.seatType}
                    onChange={(e) => handleChange("seatType", e.target.value)}
                    className="border p-1"
                />
            </label>

            <label className="block text-sm font-medium">Barcode-Text</label>
            <input
                type="text"
                value={data.barcode || ""}
                onChange={(e) => handleChange("barcode", e.target.value)}
                className="w-full border p-1 rounded"
            />
        </div>
    );
}
