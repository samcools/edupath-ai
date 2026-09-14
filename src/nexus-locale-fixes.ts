import { packs, nexusLanguages } from './nexus-locale';

packs.ts.tagline='Mudyondzi un’we. Riendzo rin’we ro dyondza. Nkarhi lowu ringanaka.';
for (const item of nexusLanguages) {
  if (item[0] === 'ts') item[1] = 'XiTsonga';
}
