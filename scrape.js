const https = require('https');
https.get('https://appsglobal.io/assets/index-4J4G1DeL.css', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const colors = data.match(/#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|hsl\([^)]+\)/g) || [];
    const counts = {};
    colors.forEach(c => counts[c.toLowerCase()] = (counts[c.toLowerCase()]||0)+1);
    console.log("Colors in CSS:", Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,30));
  });
}).on('error', (e) => {
  console.error(e);
});
