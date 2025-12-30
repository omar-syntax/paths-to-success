import { useLang } from '@/contexts/LangContext';
import { FileUp, Bell, LayoutDashboard, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FeaturesSection = () => {
  const { t } = useLang();

  const features = [
    {
      icon: Trophy,
      title: t('feature1Title'),
      description: t('feature1Desc'),
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-500',
    },
    {
      icon: Bell,
      title: t('feature2Title'),
      description: t('feature2Desc'),
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500',
    },
    {
      icon: FileUp,
      title: t('feature3Title'),
      description: t('feature3Desc'),
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-500',
    },
    {
      icon: LayoutDashboard,
      title: t('feature4Title'),
      description: t('feature4Desc'),
      gradient: 'from-primary/20 to-purple-500/20',
      iconColor: 'text-primary',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuresTitle')}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <CardContent className="relative p-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
