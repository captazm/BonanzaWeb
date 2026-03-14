const PROJECT_ID = 'bonanza-website-95e08';

const go103Product = {
    id: 'go103',
    name: 'BOOX Go 10.3',
    series: 'Go',
    tagline: '10.3" HD E Ink Carta 1200 glass screen',
    description: 'The BOOX Go 10.3 is an ultra-thin and lightweight monochrome ePaper device. With a 300 PPI screen, a 2.4GHz CPU, and a range of note-taking tools, capture your ideas with the flexibility to unleash your creative mind.',
    price: '1,400,000 MMK',
    featured: false,
    badge: 'NEW',
    specs: {
        screen: '10.3" HD ePaper glass screen with flat cover-lens',
        resolution: '2480x1860 (300 ppi)',
        cpu: '2.4GHz Octa-core',
        ram: '4GB',
        storage: '64GB',
        os: 'Android 12',
        connectivity: 'Wi-Fi (2.4GHz + 5GHz) + BT 5.0',
        battery: '3,700mAh Li-ion Polymer',
        weight: '375g (13.2oz)',
        dimensions: '235 × 183 × 4.6 mm',
        extras: 'Power Button, Built-in Dual Speakers, Built-in Microphone, USB-C (OTG/Audio)'
    },
    colors: ['White'],
    images: ['/images/products/go103.jpg'],
    video: ''
};

function buildFirestoreDocument(data) {
    const fields = {};
    for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) {
            fields[key] = { nullValue: null };
        } else if (typeof value === 'boolean') {
            fields[key] = { booleanValue: value };
        } else if (typeof value === 'number') {
            fields[key] = { doubleValue: value };
        } else if (typeof value === 'string') {
            fields[key] = { stringValue: value };
        } else if (Array.isArray(value)) {
            fields[key] = {
                arrayValue: {
                    values: value.map(v => ({ stringValue: v }))
                }
            };
        } else if (typeof value === 'object') {
            fields[key] = { mapValue: { fields: buildFirestoreDocument(value).fields } };
        }
    }
    return { fields };
}

async function pushProduct() {
    const doc = buildFirestoreDocument(go103Product);
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products/go103?updateMask.fieldPaths=name&updateMask.fieldPaths=series&updateMask.fieldPaths=tagline&updateMask.fieldPaths=description&updateMask.fieldPaths=price&updateMask.fieldPaths=featured&updateMask.fieldPaths=badge&updateMask.fieldPaths=specs&updateMask.fieldPaths=colors&updateMask.fieldPaths=images&updateMask.fieldPaths=video`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doc)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload: ${response.status} ${response.statusText}\n${errorText}`);
        }

        console.log(`Successfully uploaded product: go103`);
    } catch (error) {
        console.error(`Error uploading go103:`, error);
    }
}

pushProduct();
