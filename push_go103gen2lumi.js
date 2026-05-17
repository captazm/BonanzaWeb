// Push BOOX Go 10.3 Gen II Lumi + price to Firebase
// Run: node push_go103gen2lumi.js

const PROJECT_ID = 'bonanza-website-95e08';

const product = {
  id: 'go103gen2lumi',
  name: 'BOOX Go 10.3 (Gen II) Lumi',
  series: 'Go',
  tagline: '10.3" B&W ePaper Tablet with Dual-Tone Front Light',
  description: "The Go 10.3 (Gen II) Lumi is the latest evolution in BOOX's Go series — ultra-slim at just 4.8mm, with a first-ever integrated dual-tone front light for comfortable reading day and night. Powered by Android 15 and the upgraded Snapdragon 750G octa-core processor, it delivers crisp 300 PPI reading with the InkSense Plus stylus for natural pen-on-paper writing. Perfect for readers, writers, and professionals on the go.",
  price: '2,000,000 MMK',
  featured: false,
  published: true,
  badge: 'NEW',
  featuredImage: '/images/products/go103.png',
  createdAt: new Date().toISOString(),
};

async function pushProduct(p) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products/${p.id}`;
  const fields = {};
  for (const [key, val] of Object.entries(p)) {
    if (typeof val === 'string')  fields[key] = { stringValue: val };
    if (typeof val === 'boolean') fields[key] = { booleanValue: val };
  }
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  console.log(`✅ ${p.name} — ${p.price}`);
}

(async () => {
  console.log('Pushing Go 10.3 Gen II Lumi...\n');
  try {
    await pushProduct(product);
    console.log('\nDone!');
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
