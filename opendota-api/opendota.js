/**
 * OpenDota API Skill
 * Query Dota 2 hero item builds from recent matches
 */

const https = require('https');

const BASE_URL = 'https://api.opendota.com/api';

// Common item ID mapping (subset of most popular items)
const ITEM_MAP = {
  1: "blink", 63: "ultimate_scepter", 100: "black_king_bar",
  102: "ultimate_scepter_2", 108: "aghanims_shard", 116: "octarine_core",
  123: "shard", 133: "black_king_bar", 135: "power_treads",
  137: "phase_boots", 139: "travel_boots", 141: "travel_boots_2",
  143: "butterfly", 145: "heart", 147: "rapier",
  149: "abyssal_blade", 151: "bloodstone", 152: "sphere",
  154: "lotus_orb", 156: "solar_crest", 158: "octarine_core",
  160: "satanic", 162: "mjollnir", 164: "assault",
  166: "shivas_guard", 168: "bloodthorn", 170: "monkey_king_bar",
  172: "radiance", 174: "maelstrom", 178: "desolator",
  180: "yasha", 182: "mask_of_madness", 185: "diffusal_blade",
  190: "battle_fury", 196: "manta", 201: "skadi",
  204: "sange_and_yasha", 206: "sange", 208: "helm_of_the_dominator",
  210: "crimson_guard", 212: "pipe", 214: "armlet",
  216: "invis_sword", 218: "sylvan_cleaver", 220: "orchid",
  222: "greater_crit", 224: "lesser_crit", 226: "dagon",
  228: "necronomicon", 230: "ultimate_scepter", 232: "refresher",
  236: "boots_of_elves", 237: "quarterstaff", 238: "helm_of_iron_will",
  241: "boots", 242: "gloves", 243: "cloak",
  244: "ring_of_regen", 246: "boots_of_elves", 247: "belt_of_strength",
  248: "robe_of_magi", 249: "crown", 250: "dragon_lance",
  252: "kaya", 254: "trident", 256: "kaya_and_sange",
  259: "eternal_shroud", 263: "wind_lace", 265: "tranquil_boots",
  267: "shadow_amulet", 269: "glimmer_cape", 273: "force_staff",
  277: "dagon_2", 278: "dagon_3", 279: "dagon_4",
  280: "dagon_5", 281: "rod_of_atos", 283: "ancient_janggo",
  285: "medallion_of_courage", 287: "urn_of_shadows", 289: "spirit_vessel",
  291: "meteor_hammer", 293: "null_talisman", 294: "wraith_band",
  295: "bracer", 296: "magic_wand", 297: "infused_raindrop",
  298: "wind_lace", 299: "bottle", 300: "ward_observer",
  301: "ward_sentry", 302: "tango", 303: "courier",
  304: "tpscroll", 305: "travel_boots", 306: "travel_boots_2",
  307: "clarity", 308: "flask", 309: "dust",
  310: "smoke_of_deceit", 311: "gem", 312: "cheese",
  313: "magic_stick", 314: "recipe_magic_wand", 315: "magic_wand",
  316: "ghost", 317: "claymore", 318: "broadsword",
  319: "chainmail", 320: "mithril_hammer", 321: "platemail",
  322: "relic", 323: "hyperstone", 324: "ring_of_health",
  325: "void_stone", 326: "mystic_staff", 327: "energy_booster",
  328: "point_booster", 329: "vitality_booster", 330: "staff_of_wizardry",
  331: "ogre_axe", 332: "blade_of_alacrity", 333: "mantle",
  334: "iron_branch", 335: "gauntlets", 336: "slippers",
  337: "circlet", 338: "ogre_club", 339: "blade_mail",
  340: "soul_booster", 341: "hood_of_defiance", 342: "rapier",
  343: "monkey_king_bar", 344: "radiance", 345: "butterfly",
  346: "greater_crit", 347: "lesser_crit", 348: "battle_fury",
  349: "manta", 350: "lesser_crit", 351: "crystalys",
  352: "armlet", 353: "invis_sword", 354: "sange_and_yasha",
  355: "satanic", 356: "mjollnir", 357: "skadi",
  358: "sange", 359: "helm_of_the_dominator", 360: "maelstrom",
  361: "desolator", 362: "yasha", 363: "mask_of_madness",
  364: "diffusal_blade", 365: "diffusal_blade", 366: "ethereal_blade",
  367: "soul_ring", 368: "arcane_boots", 369: "orb_of_venom",
  370: "stout_shield", 371: "recipe_invis_sword", 372: "invis_sword",
  373: "recipe_ancient_janggo", 374: "ancient_janggo", 375: "medallion_of_courage",
  376: "smoke_of_deceit", 377: "ward_observer", 378: "ward_sentry",
  379: "recipe_orchid", 380: "orchid", 381: "recipe_greater_crit",
  382: "greater_crit", 383: "recipe_butterfly", 384: "butterfly",
  385: "recipe_rapier", 386: "rapier", 387: "recipe_monkey_king_bar",
  388: "monkey_king_bar", 389: "recipe_greater_crit", 390: "greater_crit",
  391: "recipe_battle_fury", 392: "battle_fury", 393: "recipe_manta",
  394: "manta", 395: "recipe_lesser_crit", 396: "lesser_crit",
  397: "recipe_yasha", 398: "yasha", 399: "recipe_manta",
  400: "manta", 401: "recipe_sange", 402: "sange",
  403: "recipe_helm_of_the_dominator", 404: "helm_of_the_dominator",
  405: "recipe_mjollnir", 406: "mjollnir", 407: "recipe_skadi",
  408: "skadi", 409: "recipe_satanic", 410: "satanic",
  411: "recipe_assault", 412: "assault", 413: "recipe_heart",
  414: "heart", 415: "recipe_bkb", 416: "black_king_bar",
  417: "recipe_aegis", 418: "aegis", 419: "recipe_shivas_guard",
  420: "shivas_guard", 421: "recipe_bloodstone", 422: "bloodstone",
  423: "recipe_sphere", 424: "sphere", 425: "recipe_vanguard",
  426: "vanguard", 427: "recipe_blade_mail", 428: "blade_mail",
  429: "recipe_soul_booster", 430: "soul_booster", 431: "recipe_hood_of_defiance",
  432: "hood_of_defiance", 433: "recipe_rapier", 434: "rapier",
  435: "recipe_monkey_king_bar", 436: "monkey_king_bar", 437: "recipe_orchid",
  438: "orchid", 439: "recipe_greater_crit", 440: "greater_crit",
  441: "recipe_blink", 442: "blink", 443: "recipe_dagon",
  444: "dagon", 445: "recipe_necronomicon", 446: "necronomicon",
  447: "recipe_ultimate_scepter", 448: "ultimate_scepter", 449: "recipe_refresher",
  450: "refresher", 451: "recipe_assault", 452: "assault",
  453: "recipe_heart", 454: "heart", 455: "recipe_bkb",
  456: "black_king_bar", 457: "recipe_aegis", 458: "aegis",
  459: "recipe_shivas_guard", 460: "shivas_guard", 461: "recipe_bloodstone",
  462: "bloodstone", 463: "recipe_sphere", 464: "sphere",
  465: "recipe_vanguard", 466: "vanguard", 467: "recipe_blade_mail",
  468: "blade_mail", 469: "recipe_soul_booster", 470: "soul_booster",
  471: "recipe_hood_of_defiance", 472: "hood_of_defiance", 473: "recipe_blink",
  474: "blink", 475: "recipe_dagon", 476: "dagon",
  477: "recipe_necronomicon", 478: "necronomicon", 479: "recipe_ultimate_scepter",
  480: "ultimate_scepter", 481: "recipe_refresher", 482: "refresher",
  483: "recipe_assault", 484: "assault", 485: "recipe_heart",
  486: "heart", 487: "recipe_bkb", 488: "black_king_bar",
  489: "recipe_aegis", 490: "aegis", 491: "recipe_shivas_guard",
  492: "shivas_guard", 493: "recipe_bloodstone", 494: "bloodstone",
  495: "recipe_sphere", 496: "sphere", 497: "recipe_vanguard",
  498: "vanguard", 499: "recipe_blade_mail", 500: "blade_mail",
  501: "recipe_soul_booster", 502: "soul_booster", 503: "recipe_hood_of_defiance",
  504: "hood_of_defiance", 505: "recipe_blink", 506: "blink",
  507: "recipe_dagon", 508: "dagon", 509: "recipe_necronomicon",
  510: "necronomicon", 511: "recipe_ultimate_scepter", 512: "ultimate_scepter",
  513: "recipe_refresher", 514: "refresher", 5000: "neutral_item",
  5001: "neutral_item", 5002: "neutral_item", 5003: "neutral_item",
  5004: "neutral_item", 5005: "neutral_item", 5006: "neutral_item",
  5007: "neutral_item", 5008: "neutral_item", 5009: "neutral_item",
  5010: "neutral_item", 5011: "neutral_item", 5012: "neutral_item",
  5013: "neutral_item", 5014: "neutral_item", 5015: "neutral_item",
  5016: "neutral_item", 5017: "neutral_item", 5018: "neutral_item",
  5019: "neutral_item", 5020: "neutral_item", 5021: "neutral_item",
  5022: "neutral_item", 5023: "neutral_item", 5024: "neutral_item",
  5025: "neutral_item", 5026: "neutral_item", 5027: "neutral_item",
  5028: "neutral_item", 5029: "neutral_item", 5030: "neutral_item",
  5031: "neutral_item", 5032: "neutral_item", 5033: "neutral_item",
  5034: "neutral_item", 5035: "neutral_item", 5036: "neutral_item",
  5037: "neutral_item", 5038: "neutral_item", 5039: "neutral_item",
  5040: "neutral_item", 5041: "neutral_item", 5042: "neutral_item",
  5043: "neutral_item", 5044: "neutral_item", 5045: "neutral_item",
  5046: "neutral_item", 5047: "neutral_item", 5048: "neutral_item",
  5049: "neutral_item", 5050: "neutral_item", 5051: "neutral_item",
  5052: "neutral_item", 5053: "neutral_item", 5054: "neutral_item",
  5055: "neutral_item", 5056: "neutral_item"
};

/**
 * Make HTTP request to OpenDota API
 */
function request(endpoint) {
  return new Promise((resolve, reject) => {
    https.get(`${BASE_URL}${endpoint}`, {
      headers: { 'User-Agent': 'OpenClaw-Skill/1.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`API Error ${res.statusCode}: ${data}`));
            return;
          }
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Get hero ID by name
 */
async function getHeroId(heroName) {
  const heroes = await request('/heroes');
  const hero = heroes.find(h => 
    h.localized_name.toLowerCase() === heroName.toLowerCase() ||
    h.name.toLowerCase() === heroName.toLowerCase()
  );
  return hero ? hero.id : null;
}

/**
 * Get all heroes list
 */
async function getHeroes() {
  return await request('/heroes');
}

/**
 * Get match details with item data
 */
async function getMatchDetails(matchId) {
  return await request(`/matches/${matchId}`);
}

/**
 * Get item name from ID
 */
function getItemName(itemId) {
  return ITEM_MAP[itemId] || `item_${itemId}`;
}

/**
 * Get hero item builds by analyzing recent matches
 */
async function getHeroItemBuilds(heroName, matchLimit = 10) {
  const heroId = await getHeroId(heroName);
  if (!heroId) {
    throw new Error(`Hero "${heroName}" not found`);
  }

  // Get recent matches for this hero
  const matches = await request(`/heroes/${heroId}/matches?limit=${matchLimit}`);
  
  if (matches.length === 0) {
    throw new Error(`No recent matches found for ${heroName}`);
  }

  // Analyze items from each match
  const itemStats = {};
  let wins = 0;
  let losses = 0;
  let analyzedMatches = 0;

  for (const match of matches.slice(0, matchLimit)) {
    try {
      const matchDetails = await getMatchDetails(match.match_id);
      const player = matchDetails.players.find(p => p.hero_id === heroId);
      
      if (!player) continue;
      
      analyzedMatches++;
      const isWin = matchDetails.radiant_win === (player.player_slot < 128);
      if (isWin) wins++; else losses++;

      // Collect 6 slot items
      for (let i = 0; i <= 5; i++) {
        const itemId = player[`item_${i}`];
        if (itemId) {
          const itemName = getItemName(itemId);
          if (!itemStats[itemName]) {
            itemStats[itemName] = { name: itemName, wins: 0, losses: 0, total: 0 };
          }
          itemStats[itemName].total++;
          if (isWin) itemStats[itemName].wins++;
          else itemStats[itemName].losses++;
        }
      }
      
      // Rate limit: wait 100ms between requests
      await new Promise(r => setTimeout(r, 100));
      
    } catch (e) {
      console.error(`Error fetching match ${match.match_id}:`, e.message);
    }
  }

  // Calculate win rates
  const itemBuilds = Object.values(itemStats).map(item => ({
    ...item,
    win_rate: item.total > 0 ? ((item.wins / item.total) * 100).toFixed(1) : '0.0',
    pick_rate: analyzedMatches > 0 ? ((item.total / analyzedMatches) * 100).toFixed(1) : '0.0'
  }));

  // Sort by win rate (minimum 1 pick)
  itemBuilds.sort((a, b) => parseFloat(b.win_rate) - parseFloat(a.win_rate));

  return {
    heroName,
    heroId,
    matchesAnalyzed: analyzedMatches,
    record: `${wins}W - ${losses}L (${analyzedMatches > 0 ? ((wins/analyzedMatches)*100).toFixed(1) : 0}% WR)`,
    items: itemBuilds
  };
}

/**
 * Get hero stats summary
 */
async function getHeroStats(heroName) {
  const heroId = await getHeroId(heroName);
  if (!heroId) {
    throw new Error(`Hero "${heroName}" not found`);
  }

  const details = await request(`/heroes/${heroId}`);
  const matches = await request(`/heroes/${heroId}/matches?limit=10`);
  
  const wins = matches.filter(m => m.radiant_win === (m.player_slot < 128)).length;
  
  return {
    heroName,
    heroId,
    details,
    recentRecord: `${wins}W - ${matches.length - wins}L`
  };
}

/**
 * Format item builds for display
 */
function formatBuilds(data) {
  if (!data || !data.items || data.items.length === 0) {
    return 'No item data available';
  }

  let output = `🎯 **${data.heroName}** - Item Build Analysis\n`;
  output += `📊 Matches Analyzed: ${data.matchesAnalyzed}\n`;
  output += `📈 Record: ${data.record}\n\n`;
  
  output += `**Core Items (Top 10 by Win Rate):**\n`;
  data.items.slice(0, 10).forEach((item, i) => {
    const bar = '█'.repeat(Math.min(10, Math.round(parseFloat(item.pick_rate) / 10)));
    output += `${i + 1}. **${item.name}** - ${item.win_rate}% WR | ${bar} ${item.pick_rate}% (${item.total})\n`;
  });

  return output;
}

/**
 * Format hero details for display
 */
function formatHeroDetails(details) {
  if (!details) return 'No data available';
  
  let output = `🦸 **${details.localized_name}**\n\n`;
  output += `**Primary Attribute:** ${details.primary_attr.toUpperCase()}\n`;
  output += `**Attack Type:** ${details.attack_type}\n`;
  output += `**Roles:** ${details.roles.join(', ')}\n`;
  
  return output;
}

module.exports = {
  getHeroItemBuilds,
  getHeroStats,
  getHeroes,
  getHeroId,
  getMatchDetails,
  getItemName,
  formatBuilds,
  formatHeroDetails
};
