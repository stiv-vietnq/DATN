import type { CSSProperties, ChangeEvent } from "react";
import "./DateRangePicker.css";

interface DateRangePickerProps {
    fromDate: string | null;
    toDate: string | null;
    onChangeFrom: (value: string | null) => void;
    onChangeTo: (value: string | null) => void;
    label?: string;
    error?: string;
    style?: CSSProperties;
    disabled?: boolean;
}

const DateRangePicker = ({
    fromDate,
    toDate,
    onChangeFrom,
    onChangeTo,
    error,
    style = {},
    disabled = false,
}: DateRangePickerProps) => {
    const handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        onChangeFrom(val === "" ? null : val);
    };

    const handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        onChangeTo(val === "" ? null : val);
    };

    return (
        <div className="date-range-wrapper" style={style}>
            <div className="date-range-fields">
                <input
                    type="date"
                    value={fromDate ?? ""}
                    onChange={handleFromChange}
                    className={`date-input ${error ? "date-input-error" : ""}`}
                    disabled={disabled}
                />
                <span className="date-separator">~</span>
                <input
                    type="date"
                    value={toDate ?? ""}
                    onChange={handleToChange}
                    className={`date-input ${error ? "date-input-error" : ""}`}
                    disabled={disabled}
                />
            </div>

            {error && <div className="date-range-error-message">{error}</div>}
        </div>
    );
};

export default DateRangePicker;
