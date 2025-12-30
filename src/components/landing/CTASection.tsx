import { Button } from '@/components/ui/button';
import { useLang } from '@/contexts/LangContext';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const { t, lang } = useLang();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-8">
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('ctaTitle')}
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          
          <Button asChild size="lg" className="group text-lg px-10 py-7 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30">
            <Link to="/signup">
              {t('ctaButton')}
              <Arrow className="w-5 h-5 ms-2 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
