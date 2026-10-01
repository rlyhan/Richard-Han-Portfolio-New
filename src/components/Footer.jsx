const Footer = () => {
  return (
    <footer className="flex min-h-[var(--nav-height,4rem)] items-center justify-center px-6 py-6 text-center text-sm text-carbon-400">
      © {new Date().getFullYear()} Richard Han.
    </footer>
  );
};

export default Footer;
