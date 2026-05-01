const go6Data = {
    fields: {
        id: { stringValue: 'go6' },
        name: { stringValue: 'BOOX Go 6' },
        series: { stringValue: 'Go' },
        tagline: { stringValue: '6" Pocket ePaper Reader for Your Chill Time' },
        description: { stringValue: 'A pocket-sized 6" ePaper reader with E Ink Carta 1300 display at 300 PPI, open Android 11 OS, built-in Google Play Store, and warm & cold front lights. Sleek at just 6.8mm thick and 146g, it\'s the perfect companion for reading on the go.' },
        price: { stringValue: 'Contact for Price' },
        featured: { booleanValue: true },
        badge: { stringValue: 'NEW' },
        specs: {
            mapValue: {
                fields: {
                    screen: { stringValue: '6" HD ePaper glass screen with flat cover-lens' },
                    resolution: { stringValue: '1448×1072 (300 ppi)' },
                    cpu: { stringValue: '2.0GHz Octa-core' },
                    ram: { stringValue: '2GB' },
                    storage: { stringValue: '32GB' },
                    os: { stringValue: 'Android 11' },
                    connectivity: { stringValue: 'Wi-Fi (2.4GHz + 5GHz) + BT 5.0' },
                    battery: { stringValue: '1,500mAh Li-ion Polymer' },
                    weight: { stringValue: '146g (5.15 oz)' },
                    dimensions: { stringValue: '148 × 108 × 6.8 mm' },
                    extras: { stringValue: 'Front Light (Warm/Cold CTM), Power Button, Built-in Mic, microSD, USB-C (OTG/Audio)' }
                }
            }
        },
        colors: {
            arrayValue: {
                values: [
                    { stringValue: 'Black' }
                ]
            }
        },
        image: { stringValue: '/images/products/go6.jpg' },
        video: { stringValue: '/images/products/go6.mp4' }
    }
};

const PROJECT_ID = 'bonanza-website-95e08';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products/go6`;

fetch(URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(go6Data)
})
.then(res => res.json())
.then(data => {
    if (data.error) throw new Error(JSON.stringify(data.error));
    console.log('Successfully pushed Go6 to Firestore:', data.name);
})
.catch(console.error);
