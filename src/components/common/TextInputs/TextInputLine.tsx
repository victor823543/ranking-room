import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useState } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import styles from "./TextInputLine.module.css";

type TextInputLineProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  type?: "text" | "password";
  autoComplete?: "off" | "new-password" | "current-password";
  form: UseFormReturn<TFieldValues>;
  placeholder: string;
  onInputChange?: (value: string) => void;
  icon?: React.ReactNode;
  color?: string;
  dataCy?: string;
};

const TextInputLine = <TFieldValues extends FieldValues>({
  name,
  type = "text",
  autoComplete = "off",
  form,
  placeholder,
  onInputChange,
  color = "rgb(var(--base))",
  dataCy,
  icon,
}: TextInputLineProps<TFieldValues>) => {
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({
        field: { onChange, onBlur, ref, value = "" },
        fieldState: { error },
      }) => (
        <div>
          <div
            className={classNames(
              styles.textField,
              { [styles.withIcon]: icon },
              { [styles.withFocus]: inputFocus || value.length > 0 },
            )}
            style={{ "--field-color": color } as React.CSSProperties}
            data-testid="text-field"
          >
            <div
              className={classNames(styles.placeholder, {
                [styles.focus]: inputFocus || value.length > 0,
              })}
            >
              <motion.span
                initial={false}
                animate={
                  inputFocus || value.length > 0
                    ? {
                        transform: "translate(-3rem, -1.6rem)",
                        fontSize: "0.75rem",
                      }
                    : {
                        transform: "translate(0, 0)",
                        fontSize: "1rem",
                      }
                }
                transition={{ duration: 0.3 }}
                data-testid="placeholder"
              >
                {placeholder}
              </motion.span>
            </div>
            {icon && <div className={styles.iconWrapper}>{icon}</div>}
            <input
              type={type}
              name={name}
              id={name}
              ref={ref}
              value={value}
              placeholder=""
              onChange={(e) => {
                onChange(e.target.value);
                onInputChange?.(e.target.value);
              }}
              onFocus={() => setInputFocus(true)}
              onBlur={() => {
                onBlur();
                setInputFocus(false);
              }}
              autoCapitalize="off"
              autoComplete={autoComplete}
              spellCheck="false"
              autoCorrect="off"
              className={styles.input}
              data-cy={dataCy}
              data-testid="input"
            />
          </div>
          {error && (
            <div className={styles.error} data-cy="form-error">
              <ExclamationTriangleIcon
                className={styles.errorIcon}
                aria-hidden="true"
              />
              <span className={styles.errorText}>
                {error.message?.toString()}
              </span>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default TextInputLine;
