export const generatePlaceholder = (text: string, width = 800, height = 400) => {
  return `data:image/svg+xml;utf8,<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="%231a1b1e"/><text fill="rgba(255,255,255,0.3)" xml:space="preserve" style="white-space: pre" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle" x="${width/2}" y="${height/2}">${text}</text></svg>`;
};

export const defaultProfiles = [
  { id: '1', title: 'ATYACHARI PRIV.', name: 'ATYACHARI PRIV.', author: 'Atyachari', version: '1.21.1', loader: 'Fabric', desc: 'A fully custom private modpack for Atyachari featuring extreme performance and custom aesthetic UI.', bg: generatePlaceholder('WIP - ATYACHARI PRIV. Cover'), icon: 'https://mc-heads.net/head/Atyachari/100' },
  { id: '2', title: 'MCC ISLAND FOR LUNAR', name: 'MCC ISLAND FOR LUNAR', author: 'LunarClient', version: '1.20.4', loader: 'Fabric', desc: 'The official modpack for playing on Noxcrew\'s MCC Island with custom features.', bg: generatePlaceholder('WIP - MCC ISLAND Cover'), icon: 'https://mc-heads.net/head/Notch/100' },
  { id: '3', title: 'WYNNCRAFT', name: 'WYNNCRAFT', author: 'LunarClient', version: '1.20.4', loader: 'Fabric', desc: 'The ultimate MMORPG experience in Minecraft. Custom items, quests, and massive world.', bg: generatePlaceholder('WIP - WYNNCRAFT Cover'), icon: 'https://mc-heads.net/head/Herobrine/100' },
  { id: '4', title: 'HYPIXEL SKYBLOCK', name: 'HYPIXEL SKYBLOCK', author: 'LunarClient', version: '1.8.9', loader: 'Forge', desc: 'Custom mods specifically designed for Hypixel Skyblock players. Includes NEU and SBA.', bg: generatePlaceholder('WIP - HYPIXEL SKYBLOCK Cover'), icon: 'https://mc-heads.net/head/Technoblade/100' },
  { id: '5', title: 'Vanilla+', name: 'Vanilla+', author: 'CustomClient', version: '1.20.4', loader: 'Fabric', desc: 'Standard vanilla with massive performance upgrades.', bg: generatePlaceholder('WIP - Vanilla+ Cover'), icon: 'https://mc-heads.net/head/Steve/100' }
];
