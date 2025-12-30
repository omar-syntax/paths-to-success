import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Menu, X, Globe } from 'lucide-react';
import logo from '@/assets/logo.webp';

const LandingNavbar = () => {
  const { t, lang, setLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="fixed top-0 start-0 end-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-12 w-auto rounded-lg" />
            <span className="font-bold text-lg hidden sm:inline">{t('platformName')}</span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-foreground"
            >
              <Globe className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button variant="ghost" asChild>
              <Link to="/login">{t('login')}</Link>
            </Button>

            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/signup">{t('signup')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-3 border-b border-border/30">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLanguage}
                >
                  <Globe className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
              </div>

              <Button variant="ghost" asChild className="justify-start">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  {t('login')}
                </Link>
              </Button>

              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  {t('signup')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;
