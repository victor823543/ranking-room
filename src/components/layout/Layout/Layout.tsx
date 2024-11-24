import React from "react";
import BackgroundBlur from "../../../assets/svgs/BackgroundBlur";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
  name: string;
};

const Layout: React.FC<LayoutProps> = ({ children, name }) => {
  return (
    <>
      <div className={styles.layout}>
        {/* NavBar for Phone */}
        <Navbar />

        {/* Sidebar for Desktop */}
        <Sidebar selected={name} />
      </div>
      {/* Main Content */}
      <div className={styles.mainContent}>{children}</div>
      {/* Background */}
      <div className={styles.background}>
        {/* <img src={geoBackground} alt="background" /> */}
        <BackgroundBlur />
      </div>
    </>
  );
};

export default Layout;
