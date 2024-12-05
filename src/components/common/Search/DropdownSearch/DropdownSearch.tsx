import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import styles from "./DropdownSearch.module.css";

export interface SearchObject {
  href: string;
  title: string;
  description?: string;
}

interface DropdownSearchProps {
  /** An array of search objects to display in the dropdown. */
  items: SearchObject[];
  /** If true, the dropdown is always visible when focused on input. */
  showAlways?: boolean;
  /** Placeholder text for the input field. */
  placeholder?: string;
}

/**
 * A search input field that filters and displays a dropdown list of items based on user input.
 * The component is designed to show search results dynamically as the user types in the input field.
 * When clicking on a search result the user is redirected to its href.
 *
 * @returns The rendered DropdownSearch component.
 */
const DropdownSearch: React.FC<DropdownSearchProps> = ({
  items,
  showAlways = false,
  placeholder = "Search...",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredList, setFilteredList] = useState<SearchObject[]>(
    showAlways ? items : [],
  );
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (searchValue.length > 1) {
      setFilteredList(() => {
        return [...items].filter((item) =>
          item.title.toLowerCase().includes(searchValue.toLowerCase()),
        );
      });
    } else {
      setFilteredList(showAlways ? items : []);
    }
  }, [searchValue, items]);

  return (
    <div className={styles.search}>
      <div className={styles.searchField} onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <MagnifyingGlassIcon className={styles.inputSearchIcon} />
      </div>
      {(searchValue.length > 1 || (showAlways && isFocus)) && (
        <div className={styles.searchDropdown}>
          {filteredList.map((item, index) => (
            <a
              href={item.href}
              className={styles.searchObject}
              key={item.title + index}
            >
              <p className={styles.title}>{item.title}</p>
              {item.description && (
                <p className={styles.description}>{item.description}</p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSearch;
