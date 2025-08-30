import { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from "../functions/useClickOutside";

import "./PopoverPicker.css";

export default function PopoverPicker({ color, onChange }: any) {
    const popover = useRef(null);
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <div className="picker" >
            <div
                className="swatch"
                style={{ backgroundColor: color }
                }
                onClick={() => toggle(true)}
            />

            {
                isOpen && (
                    <div className="popover" ref={popover} >
                        <HexColorPicker color={color} onChange={onChange} />
                    </div>
                )
            }
        </div>
    );
};
