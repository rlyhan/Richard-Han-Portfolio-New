import cn from "classnames";
import { useRouter } from "../routes/RouterContext";
import { findRoute } from "../routes/routes";

export const COPYRIGHT = `© ${new Date().getFullYear()} Richard Han.`;

const Footer = () => {
  const { path } = useRouter();

  return (
    <footer
      className={cn(
        "flex min-h-[var(--nav-height,4rem)] items-center justify-center px-6 py-6 text-center text-sm text-ash",
        findRoute(path)?.hasOwnFooter && "hidden",
      )}
    >
      {COPYRIGHT}
    </footer>
  );
};

export default Footer;
