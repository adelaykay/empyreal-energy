import React from 'react';
import { Zap, Building, Sparkles, Check, BatteryCharging, Sun } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatPrice } from '@/lib/utils';
import { SolarPackage, formatNumber } from '@/lib/packages';

const ICONS = { essential: Zap, professional: Building, executive: Sparkles };

export const PackageCard: React.FC<{ pkg: SolarPackage; children?: React.ReactNode; showIncludes?: boolean }> = ({
  pkg,
  children,
  showIncludes = false,
}) => {
  const Icon = ICONS[pkg.id];
  return (
    <Card className="relative flex flex-col h-full">
      <div className="absolute top-5 right-5">
        <Badge>{pkg.badge}</Badge>
      </div>
      <div className="w-14 h-14 bg-gradient-green rounded-2xl flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-dark-bg" />
      </div>
      <h3 className="font-orbitron text-2xl font-bold mb-1">{pkg.name}</h3>
      <p className="text-text-muted text-sm mb-5">{pkg.bestFor}</p>

      <div className="mb-5">
        <span className="text-xs text-text-muted uppercase tracking-wider">Starting from</span>
        <div className="text-4xl font-bold text-primary-green">{formatPrice(pkg.price)}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass rounded-xl p-3">
          <BatteryCharging className="w-4 h-4 text-primary-green mb-1" />
          <div className="font-orbitron font-bold text-lg leading-tight">{formatNumber(pkg.backupWh)} Wh</div>
          <div className="text-xs text-text-muted">Backup capacity</div>
        </div>
        <div className="glass rounded-xl p-3">
          <Sun className="w-4 h-4 text-accent-yellow mb-1" />
          <div className="font-orbitron font-bold text-lg leading-tight">{formatNumber(pkg.solarW)} W</div>
          <div className="text-xs text-text-muted">Solar supply</div>
        </div>
      </div>

      <h4 className="eyebrow mb-3">Powers</h4>
      <ul className="space-y-2 mb-6">
        {pkg.powers.map((f) => (
          <li key={f} className="text-sm text-text-muted flex items-start gap-2">
            <Check className="w-4 h-4 text-primary-green mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      {showIncludes && (
        <div className="mb-6 p-4 bg-primary-green/5 rounded-xl border border-primary-green/10">
          <h4 className="eyebrow mb-2">Package includes</h4>
          <ul className="space-y-1">
            {pkg.includes.map((i) => (
              <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                <Check className="w-3 h-3 text-primary-green mt-0.5 flex-shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto">{children}</div>
    </Card>
  );
};
