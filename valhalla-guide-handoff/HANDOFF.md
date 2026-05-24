# ValhallaMMO Guide — Handoff for Claude Code

## What this is
A single-file HTML player guide for the ValhallaMMO Minecraft plugin (v1.9.3) with the Classic import pack. Built from real plugin data.

## Files
- `valhalla-guide.html` — the HTML template (has __DATA__ and __SCRIPT__ placeholders); assembled output is `../index.html`
- `data.json` — skill descriptions, XP curves, smithing steps, fit ingredients, tinker upgrades + ingredients
- `app.js` — the rendering script (has __RECIPES__ placeholder)
- `recipes.json` — flat recipe list [name, system, xp]
- `recipe_slim.json` — recipe details {name: {i: ingredients, x: xp, r: requirements, e: effects, s: system}}
- `classic.json` — the original source of truth (the user's import file)
- `ValhallaMMO_1_9_3.jar` — the plugin JAR (skills, configs inside at skills/*.yml)

## Assembly
```python
script = app_js.replace('__RECIPES__', recipes_json)
script = f"const RECIPE_DETAILS = {recipe_slim_json};\n{script}"
html = template.replace('__DATA__', data_json).replace('__SCRIPT__', script)
```

## What still needs fixing (the reason for this handoff)

### 1. Tinker "applies to" values are WRONG in recipe_slim.json
The `recipe_slim.json` detail panel still shows old incorrect values. Need to rebuild it using the corrected map:
- Elemental damages (fire/magic/poison/necrotic/radiant) → **Armor** (not weapon)
- damage_all → **Armor**
- Sprint speed → **Leggings** (not boots)  
- Sneak speed → **Leggings** (not boots)
- Smithing/enchanting/alchemy quality → **Helmet only**
- Mining drops/luck → **Tool** (any tool, not just pickaxe)
- Durability multiplier → **Any tool or armor**
- Bonus slots → **Any weapon/tool/armor**

The corrected values ARE in data.json (tinkerIngredients field), but recipe_slim.json was generated before the fix.

### 2. Recipe detail panel could show more
When clicking a recipe row, the detail panel works but could be improved:
- Show the crafting grid layout visually (which slot = which item)
- For craft recipes, show what the output item is
- For tinker upgrades, show the stat value (+0.1 sprint speed, etc.)

### 3. Verified errors found and fixed so far
1. "15 skills" → 14 ✓ fixed
2. "559 recipes" → 555 ✓ fixed  
3. Quench "300 XP" → 300-2400 ✓ fixed
4. "47 upgrades" → 49 ✓ fixed
5. Digging diamond label ✓ fixed
6. Quench workflow was backwards (said drop hot ingot, actually drop heated weapon) ✓ fixed
7. Whetstone was fabricated ✓ fixed
8. Hot ingots are used for FITTING armor (not unused) ✓ fixed
9. Sprint/sneak apply to leggings not boots ✓ fixed in data.json, NOT yet in recipe_slim.json

### 4. Source of truth
- Recipes/crafting: classic.json (the uploaded file)
- Skills/XP/leveling: skills/*.yml inside the JAR
- To verify ANY claim, decode the actual recipe from classic.json
- Ingredient materials are in base64-serialized Bukkit ItemStacks inside each recipe's items dict
