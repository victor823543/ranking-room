import React from "react";
import { Link } from "react-router-dom";
import BackgroundBlurAuth from "../../../assets/svgs/BackgroundBlurAuth";
import Logo from "../../../assets/svgs/Logo";
import styles from "./AuthLayout.module.css";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  redirect: { message: string; linkText: string; href: string };
};

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  redirect,
}) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.logoWrapper}>
            <Logo />
          </div>
          <div className={styles.textContainer}>
            <h1 className={styles.h1}>{title}</h1>
            <p className={styles.p}>
              <span>{redirect.message} </span>
              <Link to={redirect.href} className={styles.link}>
                {redirect.linkText}
              </Link>
            </p>
          </div>
          <div className={styles.formContainer}>{children}</div>
        </main>
      </div>

      {/* Background */}
      <div className={styles.background}>
        <BackgroundBlurAuth />
      </div>
    </div>
  );
};

export default AuthLayout;
