import { useLang } from '@/contexts/LangContext';
import logo from '@/assets/logo.webp';

const Footer = () => {
  const { t } = useLang();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border/50 bg-card/30">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
            <span className="font-bold text-lg">{t('platformName')}</span>
          </div>
          
          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © {currentYear} {t('platformName')}. {t('footerRights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
