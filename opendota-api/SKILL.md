# OpenDota API Skill 🎮

Query Dota 2 hero item builds and stats from the OpenDota API.

## Features

- **Hero Item Builds** - Get best items for any hero by win rate from recent matches
- **Hero Stats** - View recent match performance
- **Hero List** - Browse all 127 Dota 2 heroes
- **Real-time Data** - Live data from OpenDota API

## Usage

### Query Hero Item Builds (Main Feature)

```javascript
const opendota = require('./opendota.js');

// Get item builds for a hero (analyzes recent matches)
const builds = await opendota.getHeroItemBuilds('Anti-Mage', 5);
console.log(opendota.formatBuilds(builds));
```

**Example Output:**
```
🎯 **Anti-Mage** - Item Build Analysis
📊 Matches Analyzed: 5
📈 Record: 3W - 2L (60.0% WR)

**Core Items (Top 10 by Win Rate):**
1. **butterfly** - 100.0% WR | ███ 40.0% (2)
2. **battle_fury** - 75.0% WR | ████████ 80.0% (4)
3. **manta** - 66.7% WR | ██████████ 100.0% (5)
...
```

### Get Hero Stats

```javascript
const stats = await opendota.getHeroStats('Pudge');
console.log(stats);
```

### List All Heroes

```javascript
const heroes = await opendota.getHeroes();
heroes.forEach(h => console.log(h.localized_name));
```

### Get Hero ID by Name

```javascript
const heroId = await opendota.getHeroId('Crystal Maiden');
console.log(heroId); // Returns hero ID number
```

## API Endpoints Used

- `GET /heroes` - List all heroes
- `GET /heroes/{hero_id}/matches` - Get recent matches for a hero
- `GET /matches/{match_id}` - Get match details with item data

## Rate Limits

OpenDota API limits:
- 1 request per second for anonymous users
- Free tier: 3000 calls/day
- Consider getting an API key: https://www.opendota.com/api-keys

## Examples

### Best Items for Juggernaut

```javascript
const result = await opendota.getHeroItemBuilds('Juggernaut', 10);
console.log(opendota.formatBuilds(result));
```

### Check Hero Existence

```javascript
const heroId = await opendota.getHeroId('FakeHero');
if (!heroId) console.log('Hero not found!');
```

### Get All Carry Heroes

```javascript
const heroes = await opendota.getHeroes();
const carries = heroes.filter(h => h.roles.includes('Carry'));
carries.forEach(h => console.log(h.localized_name));
```

## Configuration

No configuration required! The skill works out of the box.

Optional: Add API key to skill.json for higher rate limits:
```json
{
  "config": {
    "apiKey": "your-opendota-api-key"
  }
}
```

## Notes

- Item data is analyzed from recent professional/public matches
- Win rates are calculated from the sampled matches
- More matches analyzed = more accurate recommendations
- Default: 10 matches (takes ~1-2 seconds due to rate limiting)

## Author

Created for OpenClaw by Assistant

## License

MIT

## Links

- [OpenDota API Docs](https://docs.opendota.com/)
- [OpenDota Website](https://www.opendota.com/)
- [Get API Key](https://www.opendota.com/api-keys)
