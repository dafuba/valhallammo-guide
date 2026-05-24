const fs = require("fs");

// Load sources
const data = JSON.parse(fs.readFileSync("data.json","utf8"));
const slim = JSON.parse(fs.readFileSync("recipe_slim.json","utf8"));
const tinkerIngredients = data.tinkerIngredients;

// Build map: stat_key -> applies-to string (second element of each array)
const appliesTo = {};
for (const [key, val] of Object.entries(tinkerIngredients)) {
  appliesTo[key] = val[1];
}

// Some recipe name suffixes don't match data.json keys exactly
const suffixOverride = {
  "immunity_bonus_flat": "immunity_bonus",
  "generic_knockback_resistance": "knockback_resistance",
  "sneak_movement_speed_bonus": "sneak_speed",
  "sprint_movement_speed_bonus": "sprint_speed",
  "jumps": "extra_jumps",
  "vanilla_exp_gain": "vanilla_exp_gain",
  "skill_exp_gain": "skill_exp_gain",
};

let fixedCount = 0;
const unmapped = [];

for (const [recipeName, details] of Object.entries(slim)) {
  if (!recipeName.startsWith("tinker_upgrade_")) continue;

  const suffix = recipeName.slice("tinker_upgrade_".length);
  const statKey = suffixOverride[suffix] !== undefined ? suffixOverride[suffix] : suffix;

  if (statKey && appliesTo[statKey]) {
    details.a = appliesTo[statKey];
    fixedCount++;
  } else {
    unmapped.push({ recipeName, suffix, statKey });
  }
}

if (unmapped.length > 0) {
  console.log("UNMAPPED tinker upgrades:");
  unmapped.forEach(u => console.log(" ", u.recipeName, "->", u.statKey));
}
console.log(`Fixed applies-to for ${fixedCount} tinker upgrades`);

fs.writeFileSync("recipe_slim.json", JSON.stringify(slim), "utf8");
console.log("Written recipe_slim.json");

// --- Now reassemble the HTML ---
const template = fs.readFileSync("valhalla-guide.html","utf8");
const recipes = fs.readFileSync("recipes.json","utf8");
const appJs = fs.readFileSync("app.js","utf8");

const script = appJs.replace("__RECIPES__", recipes);
const fullScript = `const RECIPE_DETAILS = ${JSON.stringify(slim)};\n${script}`;
const dataJson = JSON.stringify(data);

const html = template
  .replace("__DATA__", dataJson)
  .replace("__SCRIPT__", fullScript);

fs.writeFileSync("../index.html", html, "utf8");
console.log("Written ../index.html");
