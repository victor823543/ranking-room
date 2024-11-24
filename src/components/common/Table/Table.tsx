import React from "react";
import { capitalizeFirstLetter } from "../../../utils/functions/textFunctions";
import styles from "./Table.module.css";

export type TableData = Array<Record<string, React.ReactNode>>;

type TableProps = {
  data: TableData;
  showTableHead?: boolean;
};

export const Table: React.FC<TableProps> = ({ data, showTableHead = true }) => {
  if (!data || data.length === 0) return <div>Missing data</div>;

  const headings = Object.keys(data[0]);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        {showTableHead && (
          <thead>
            <tr className={`${styles.tRow} ${styles.tHead}`}>
              {headings.map((label, index) => (
                <th key={index} className={styles.th}>
                  {capitalizeFirstLetter(label)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((rowData, rowIndex) => {
            const even: boolean = rowIndex % 2 === 0;
            return (
              <tr
                className={`${even ? styles.even : styles.uneven} ${styles.tRow}`}
                key={rowIndex}
              >
                {headings.map((label, colIndex) => (
                  <td className={styles.tData} key={rowIndex + "-" + colIndex}>
                    {rowData[label.toLowerCase()]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
