import { useLang } from '@/contexts/LangContext';
import { UserPlus, FileSearch, Upload } from 'lucide-react';

const HowItWorksSection = () => {
  const { t, lang } = useLang();

  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      number: '02',
      icon: FileSearch,
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      number: '03',
      icon: Upload,
      title: t('step3Title'),
      description: t('step3Desc'),
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute top-0 start-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howItWorksTitle')}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 start-0 end-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Card */}
                  <div className="group text-center">
                    {/* Number Badge */}
                    <div className="relative inline-block mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-9 h-9 text-primary-foreground" />
                      </div>
                      <span className="absolute -top-2 -end-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                        {step.number}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
