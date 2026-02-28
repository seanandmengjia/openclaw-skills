# OpenDota API Skill 🎮

Query Dota 2 hero item builds and stats from the OpenDota API.

## Installation

```bash
npx skills add seanandmengjia/openclaw-skills@opendota-api
```

## Usage

```javascript
const opendota = require('./opendota.js');
const builds = await opendota.getHeroItemBuilds('Anti-Mage', 5);
console.log(opendota.formatBuilds(builds));
```

## License

MIT
