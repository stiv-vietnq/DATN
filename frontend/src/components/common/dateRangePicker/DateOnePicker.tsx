import type { CSSProperties, ChangeEvent } from "react";
import "./DateRangePicker.css";

interface DateOnePicker {
  date: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  error?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

const DateOnePicker = ({
  date,
  onChange,
  error = "",
  style = {},
  disabled = false,
}: DateOnePicker) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    onChange(val === "" ? null : val);
  };

  return (
    <div className="date-range-wrapper" style={style}>
      <div className="date-range-fields">
        <input
          type="date"
          value={date ?? ""}
          onChange={handleChange}
          className={`date-input ${error ? "date-input-error" : ""}`}
          disabled={disabled}
        />
      </div>

      {error && <div className="date-range-error-message">{error}</div>}
    </div>
  );
};

export default DateOnePicker;
