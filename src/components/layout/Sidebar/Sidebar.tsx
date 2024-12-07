import {
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  HomeIcon,
  RectangleGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import Logo from "../../../assets/svgs/Logo";
import useLogout from "../../../hooks/useLogout";
import styles from "./Sidebar.module.css";

type LinkItem = {
  title: string;
  href: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
};

type SidebarProps = {
  selected: string;
};

const links: LinkItem[] = [
  { title: "Dashboard", href: "/", Icon: HomeIcon },
  { title: "Rooms", href: "/rooms", Icon: RectangleGroupIcon },
  { title: "Social", href: "/social", Icon: ChatBubbleLeftRightIcon },
  { title: "Create", href: "/create", Icon: PlusIcon },
  { title: "Settings", href: "/settings", Icon: Cog6ToothIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ selected }) => {
  const logout = useLogout();
  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.sidebar}>
        <div className={styles.topSection}>
          <div className={styles.logo} aria-label="Logo">
            <Logo />
          </div>
        </div>
        <nav className={styles.links}>
          {links.map((link) => (
            <SidebarLink
              key={link.title}
              selected={selected === link.title}
              {...link}
            />
          ))}
          <div className={styles.link} onClick={() => logout()}>
            <div className={styles.iconWrapper} aria-label="Logout icon">
              <ArrowRightStartOnRectangleIcon
                strokeWidth={2}
                style={{ position: "relative", left: "2px" }}
              />
            </div>
          </div>
        </nav>
        <div className={styles.bottomSection}>
          <Link to={"/settings"} className={styles.account}>
            <UserIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

const SidebarLink: React.FC<LinkItem & { selected: boolean }> = ({
  title,
  href,
  Icon,
  selected,
}) => {
  return (
    <Link
      to={href}
      className={`${styles.link} ${selected ? styles.selected : ""}`}
    >
      <div className={styles.iconWrapper} aria-label={`${title} icon`}>
        <Icon strokeWidth={3} />
      </div>
    </Link>
  );
};

export default Sidebar;
