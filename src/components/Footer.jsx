import cn from "classnames";
import { useRouter } from "../routes/RouterContext";

const Footer = () => {
  const { footerOnSheet } = useRouter();

  return (
    <footer
      className={cn(
        "flex min-h-[var(--nav-height,4rem)] items-center justify-center px-6 py-6 text-center text-sm text-ash",
        footerOnSheet &&
          "relative bg-sheet before:absolute before:inset-x-[1.4rem] before:top-0 before:border-t before:border-grid md:before:inset-x-[clamp(1.75rem,3.2vw,3.5rem)]",
      )}
    >
      © {new Date().getFullYear()} Richard Han.
    </footer>
  );
};

export default Footer;
