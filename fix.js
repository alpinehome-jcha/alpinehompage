const fs = require('fs');
const fix = f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/public\.admin_/g, '"alpine-home".admin_');
  fs.writeFileSync(f, c, 'utf8');
};
fix('scripts/dealer_admin_rpc.sql');
fix('scripts/popup_admin_rpc.sql');
