import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import styles from "./SearchField.module.css";

type SearchFieldProps = {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const SearchField: React.FC<SearchFieldProps> = ({
  placeholder,
  onChange,
  value,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div className={`${styles.searchField} ${isFocus ? styles.focused : ""}`}>
      <MagnifyingGlassIcon className={styles.inputSearchIcon} />
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </div>
  );
};

export default SearchField;
