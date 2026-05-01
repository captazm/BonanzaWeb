// Price update script - run with: node update_prices.js
const PROJECT_ID = 'bonanza-website-95e08';

const prices = [
    { id: 'noteair5c',    price: '2,322,000 MMK' },
    { id: 'go103',        price: '1,806,000 MMK' },
    { id: 'palma2pro',    price: '1,763,000 MMK' },
    { id: 'gocolor7gen2', price: '1,247,000 MMK' },
    { id: 'palma2',       price: '1,225,500 MMK' },
    { id: 'go6',          price: '731,000 MMK'   },
];

async function updatePrice(id, price) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products/${id}?updateMask.fieldPaths=price`;
    const body = JSON.stringify({ fields: { price: { stringValue: price } } });

    const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body
    });
    const data = await res.json();
    if (data.error) throw new Error(`${id}: ${JSON.stringify(data.error)}`);
    console.log(`✅ ${id} → ${price}`);
}

(async () => {
    console.log('Updating prices in Firestore...\n');
    for (const { id, price } of prices) {
        try {
            await updatePrice(id, price);
        } catch (e) {
            console.error(`❌ ${e.message}`);
        }
    }
    console.log('\nDone!');
})();
