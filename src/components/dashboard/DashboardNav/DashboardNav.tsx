import { PlusIcon } from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./DashboardNav.module.css";

type NavItem = {
  label: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
  href: string;
  id: string;
};

const navItems: NavItem[] = [
  { label: "Rooms", href: "/rooms", Icon: RectangleGroupIcon, id: "rooms" },
  {
    label: "Social",
    href: "/social",
    Icon: ChatBubbleLeftRightIcon,
    id: "social",
  },
  { label: "Create", href: "/create", Icon: PlusIcon, id: "create" },
  { label: "Settings", href: "/settings", Icon: Cog6ToothIcon, id: "settings" },
];

enum HoverState {
  This,
  Other,
  None,
}

const DashboardNav = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={styles.grid}>
      {navItems.map((item) => (
        <DashboardNavItem
          key={item.id}
          item={item}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
};

type DahsboardNavItemProps = {
  item: NavItem;
  hovered: string | null;
  setHovered: (id: string | null) => void;
};

const DashboardNavItem: React.FC<DahsboardNavItemProps> = ({
  item,
  hovered,
  setHovered,
}) => {
  const hoverState =
    hovered === item.id
      ? HoverState.This
      : hovered === null
        ? HoverState.None
        : HoverState.Other;

  return (
    <Link
      to={item.href}
      className={styles.itemContainer}
      onMouseEnter={() => setHovered(item.id)}
      onMouseLeave={() => setHovered(null)}
    >
      <AnimatePresence>
        {hoverState === HoverState.This && (
          <motion.div
            className={styles.movingHighlight}
            layoutId="moving-highlight"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.25 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.25, delay: 0.1 },
            }}
          />
        )}
      </AnimatePresence>
      <motion.div
        className={styles.item}
        animate={
          hoverState === HoverState.Other
            ? { scale: 0.95, filter: "blur(4px)", opacity: 0.8 }
            : { scale: 1, filter: "blur(0px)", opacity: 1 }
        }
      >
        <item.Icon className={`${styles.icon} ${styles[item.id]}`} />
        <span className={styles.label}>{item.label}</span>
      </motion.div>
    </Link>
  );
};

export default DashboardNav;
