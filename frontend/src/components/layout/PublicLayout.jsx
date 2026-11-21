import react, { useState } from "react";

export function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { data } = useData();
  const nav = (
    <>
      <Link to="/" activeOptions={{ exact: true }}>
        Accueil
      </Link>
      <Link to="/jobs">Offres d’emploi</Link>
      <Link to="/stages">Stages</Link>
      <Link to="/freelance">Freelance</Link>
      <Link to="/career-advice">Conseils carrière</Link>
    </>
  );
  return (
    <>
      <header className="site-header">
        <div className="page-width header-inner">
          <Brand />
          <nav className="nav-links" aria-label="Navigation principale">
            {nav}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex h-10 text-xs">
              <Link to="/create-cv">
                <FileText />
                Créer mon CV
                <ArrowUpRight />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>
      {open && (
        <nav className="mobile-nav" aria-label="Navigation mobile" onClick={() => setOpen(false)}>
          {nav}
          <Link to="/create-cv">Créer mon CV</Link>
        </nav>
      )}
      <main>{children}</main>
      <Newsletter />
      <footer className="site-footer">
        <div className="page-width">
          <div className="footer-grid">
            <div>
              <Brand />
              <p className="mt-4 max-w-xs">
                Le talent africain mérite les meilleures opportunités. Emplois, stages et nouveaux
                horizons, au Cameroun et partout en Afrique.
              </p>
              <p className="mt-3">Offres et organismes de démonstration.</p>
            </div>
            <div>
              <h3>Explorer</h3>
              <div className="grid gap-1">
                <Link to="/jobs">Offres d’emploi</Link>
                <Link to="/stages">Stages</Link>
                <Link to="/freelance">Freelance</Link>
                <Link to="/career-advice">Conseils carrière</Link>
              </div>
            </div>
            <div>
              <h3>Opportunités</h3>
              <div className="grid gap-1">
                <Link to="/remote">Télétravail</Link>
                <Link to="/jobs" search={{ category: "Bourses" }}>
                  Bourses
                </Link>
                <Link to="/jobs" search={{ category: "Formations" }}>
                  Formations
                </Link>
                <Link to="/create-cv">Créer mon CV</Link>
              </div>
            </div>
            <div>
              <h3>Restons en contact</h3>
              <div className="grid gap-1">
                <Link to="/contact">Contact</Link>
                {safeExternalUrl(data.settings.linkedin) && (
                  <a href={data.settings.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {safeExternalUrl(data.settings.whatsapp) && (
                  <a href={data.settings.whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                )}
                <Link to="/admin">Administration démo</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} ULB JOB. Tous droits réservés.</span>
            <div className="flex flex-wrap gap-5">
              <Link to="/privacy">Politique de confidentialité</Link>
              <Link to="/terms">Conditions d’utilisation</Link>
              <span>Fait pour les talents africains.</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}