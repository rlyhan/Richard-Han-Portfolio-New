import cn from "classnames";
import { useRouter } from "../routes/RouterContext";
import { PATHS } from "../routes/routes";

export const COPYRIGHT = `© ${new Date().getFullYear()} Richard Han.`;

// The homepage has no footer: from md it carries this line itself — see HomeNav.
const Footer = () => {
  const { path } = useRouter();

  return (
    <footer
      className={cn(
        "flex min-h-[var(--nav-height,4rem)] items-center justify-center px-6 py-6 text-center text-sm text-ash",
        path === PATHS.home && "hidden",
      )}
    >
      {COPYRIGHT}
    </footer>
  );
};

export default Footer;
