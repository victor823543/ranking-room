import { CheckIcon } from "@heroicons/react/24/outline";
import { ThemeColor, useTheme } from "../../../provider/themeProvider";
import Divider from "../../common/Dividers/Dividers";
import { Header } from "../../common/Headers/Headers";
import styles from "./ThemeSettings.module.css";

const themes: Array<ThemeColor> = [
  "blue",
  "indigo",
  "violet",
  "fuchsia",
  "rose",
  "red",
  "amber",
  "yellow",
  "green",
  "teal",
  "cyan",
  "sky",
];

const ThemeSettings = () => {
  const { setColorTheme, color } = useTheme();
  return (
    <div className={styles.container}>
      <Header as="h2" center={false} variant="gridbox">
        Color Theme
      </Header>
      <Divider thickness="1px" color="rgba(var(--base), 0.5)" margin="1rem" />
      <div className={styles.colorOptions}>
        {themes.map((theme) => (
          <div
            key={theme}
            className={`${styles.option} ${color === theme ? styles.selected : ""}`}
            onClick={() => setColorTheme(theme)}
          >
            <div className={styles.background}>
              <div
                style={{ backgroundColor: `rgb(var(--${theme}-x-light))` }}
                className={styles.colorPart}
              ></div>
              <div
                style={{ backgroundColor: `rgb(var(--${theme}-light))` }}
                className={styles.colorPart}
              ></div>
              <div
                style={{ backgroundColor: `rgb(var(--${theme}))` }}
                className={styles.colorPart}
              ></div>
              <div
                style={{ backgroundColor: `rgb(var(--${theme}-mid))` }}
                className={styles.colorPart}
              ></div>
              <div
                style={{ backgroundColor: `rgb(var(--${theme}-dark))` }}
                className={styles.colorPart}
              ></div>
            </div>

            {color === theme && (
              <div className={styles.checkIcon}>
                <CheckIcon />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSettings;
