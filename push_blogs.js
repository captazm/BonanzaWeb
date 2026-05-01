// Push 3 Myanmar translated blog posts to Firebase Firestore
// Run: node push_blogs.js

const PROJECT_ID = 'bonanza-website-95e08';

const posts = [
  {
    id: 'blog-eink-technology-2024',
    title: 'E Ink နည်းပညာကို နားလည်သင့်တယ် — BOOX စက်များနှင့် ၎င်း၏ အရေးပါမှု',
    excerpt: 'E Ink နည်းပညာသည် သာမန် LCD မျက်နှာပြင်နှင့် မည်သို့ ကွဲပြားသနည်း။ မျက်လုံးကို ပင်ပန်းမှု လျှော့ချပေးသည့် ဤနည်းပညာ၏ နက်ရှိုင်းသော ရှင်းလင်းချက်ကို ဖတ်ရှုပါ။',
    content: `<h2>E Ink နည်းပညာဆိုတာ ဘာလဲ?</h2>
<p>E Ink (Electronic Ink) သည် ဒီဂျစ်တယ်ကြောင်ပြ နည်းပညာတစ်မျိုးဖြစ်ပြီး ရိုးရာ စာအုပ်မျက်နှာပြင်နှင့် အတူတူဆိုသလောက် သဘာဝကျကျ ဖတ်ရှုနိုင်သော အတွေ့အကြုံကို ပေးနိုင်သည့် နည်းပညာတစ်ရပ်ဖြစ်သည်။ BOOX e-reader မျှော်မှာ ဤနည်းပညာကို အဓိက အသုံးပြုထားသည်။</p>

<h2>E Ink ၏ လုပ်ဆောင်ပုံ</h2>
<p>E Ink မျက်နှာပြင်တွင် သေးငယ်သော Microcapsule များစွာ ပါဝင်သည်။ Microcapsule တစ်ခုချင်းစီတွင် အဖြူရောင် pigment particle (positive charge) နှင့် အမဲရောင် pigment particle (negative charge) များ ပါဝင်သည်။ လျှပ်စစ်ဓာတ်လိုင်းများ ပြောင်းလဲခြင်းဖြင့် particle များ အပေါ် သို့မဟုတ် အောက်သို့ ရွှေ့လျားကာ ဖြူသို့မဟုတ် မဲသော ရောင်စဉ်ကို ဖော်ထုတ်ပေးသည်။</p>

<h2>E Ink ၏ အားသာချက်များ</h2>
<ul>
  <li><strong>မျက်လုံးကို ပင်ပန်းမှု အလွန်နည်းသည်</strong> — LCD/OLED နှင့် မတူဘဲ backlight မလိုအပ်ဘဲ အပြင်မှ သဘာဝ အလင်းကိုသာ ပြန်ဖတ်သောကြောင့် ကြာရှည် ဖတ်ရှုသော်လည်း မျက်လုံး ပင်ပန်းမှု မဖြစ်ပေါ်နိုင်ဘူး။</li>
  <li><strong>ဘက်ထရီ သက်တမ်း ရှည်သည်</strong> — မျက်နှာပြင်ကို refresh မပြုလုပ်မချင်း လျှပ်စစ် မသုံးဘဲ image ကို ဆက်လက် ထိန်းသိမ်းနိုင်သောကြောင့် ဘက်ထရီ သုံးစွဲမှု အလွန်နည်းသည်။</li>
  <li><strong>နေရောင်ခြည်တွင် ကောင်းစွာ ဖတ်ရှုနိုင်သည်</strong> — LCD နှင့် ဆန့်ကျင်ဘက်အနေဖြင့် E Ink မျက်နှာပြင်သည် နေရောင်တိုက်ရိုက် ထိလာသောအခါ ပိုမို ရှင်းလင်းပြတ်သားစွာ မြင်ရသည်။</li>
  <li><strong>ခပ်ပါးပါးနှင့် ပေါ့ပါးသည်</strong> — E Ink panel သည် ပါးလွှာပြီး အလေးချိန် နည်းသောကြောင့် ကြာရှည် ကိုင်ဆောင်ဖတ်ရှုရာတွင် အဆင်ပြေသည်။</li>
</ul>

<h2>E Ink ၏ အားနည်းချက်များ</h2>
<ul>
  <li><strong>Refresh rate နည်းသည်</strong> — မျက်နှာပြင် ပြောင်းလဲမှု LCD ထက် နှေးကွေးသောကြောင့် Video ကြည့်ရှု ခြင်း သို့မဟုတ် Game ဆော့ကစားခြင်းအတွက် သင့်လျော်မသည်။</li>
  <li><strong>Color E Ink သည် မောင်မောင်ရောင်နည်းနည်း ရှိနိုင်သည်</strong> — ရောင်စုံ E Ink (Kaleido) မျက်နှာပြင်များသည် monochrome ထက် ပိုမိုတောက်ပသော်လည်း LCD ရောင်စုံနှင့် မနှိုင်းနိုင်သေး။</li>
</ul>

<h2>BOOX တွင် E Ink ၏ အသုံးချမှု</h2>
<p>BOOX e-reader များသည် E Ink Carta နှင့် Kaleido မျက်နှာပြင်များကို အသုံးပြုသည်။ Note Air 5C ကဲ့သို့သော Color E Ink device များသည် Kaleido 3 နည်းပညာကို အသုံးပြုကာ တောက်ပသော ရောင်စုံ ဖတ်ရှုမှုအတွေ့အကြုံကို ပေးသည်။ Go 6 နှင့် Go 10.3 ကဲ့သို့သော Monochrome device များမှာ E Ink Carta 1300 မျက်နှာပြင်ဖြင့် 300 PPI resolution ရသောကြောင့် အလွန်ပြတ်သားသော စာသားများကို ဖတ်ရှုနိုင်သည်။</p>

<h2>နိဂုံးချုပ်</h2>
<p>E Ink နည်းပညာသည် ဖတ်ရှုမှုကို ချစ်မြတ်နိုးသူများနှင့် ကြာရှည် screen ကြည့်ရသူများ အတွက် အကောင်းဆုံး ဖြေရှင်းချက်တစ်ရပ်ဖြစ်သည်။ မျက်လုံးကျန်းမာရေးကို ဦးစားပေးပြီး ဒစ်ဂျစ်တယ် ဖတ်ရှုမှု အတွေ့အကြုံကို တိုးတက်ကောင်းမွန်စေလိုပါက BOOX e-reader သည် သင့်အတွက် အကောင်းဆုံး ရွေးချယ်မှုဖြစ်သည်။</p>`,
    category: 'Guides',
    featuredImage: '/images/products/noteair5c.png',
    published: true,
    createdAt: new Date('2024-11-01').toISOString(),
  },
  {
    id: 'blog-second-monitor-2024',
    title: 'BOOX စက်ကို Second Monitor အဖြစ် အသုံးပြုနည်း — ဘယ် Model ကိုရွေးသင့်သလဲ?',
    excerpt: 'BOOX e-reader ကို ကွန်ပျူတာ monitor ဒုတိယတစ်ခုအဖြစ် အသုံးပြုလိုပါသလား? မည်သည့် model သည် ထိုလုပ်ငန်းစဉ်အတွက် အသင့်တော်ဆုံးဆိုတာကို ဤဆောင်းပါးတွင် ရှင်းလင်းဖော်ပြထားသည်။',
    content: `<h2>BOOX ကို Second Monitor အဖြစ် အသုံးပြုနိုင်ပါသလား?</h2>
<p>ဟုတ်ပါတယ်။ BOOX e-reader device အများစုသည် BOOX App (Dex Mode) မှတဆင့် Android laptop/desktop screen extension အဖြစ် ချိတ်ဆက်အသုံးပြုနိုင်သည်။ Code ရေးသားခြင်း၊ စာဖတ်ခြင်း သို့မဟုတ် reference document ကြည့်ရှုခြင်း ကဲ့သို့သော အလုပ်များအတွက် အလွန် အသုံးဝင်သည်။</p>

<h2>Second Monitor အတွက် အသင့်တော်ဆုံး BOOX Models</h2>

<h2>၁။ BOOX Note Air 5C (10.3 inch) — အကောင်းဆုံး ရွေးချယ်မှု</h2>
<ul>
  <li>စျေးနှုန်း — 2,322,000 MMK</li>
  <li>မျက်နှာပြင် — 10.3" Color E Ink Carta</li>
  <li>Resolution — 2480 x 1860 (300 PPI)</li>
  <li>OS — Android 15</li>
  <li>Stylus — BOOX Pen Plus ပါဝင်</li>
</ul>
<p>Document ဖတ်ရှုမှုနှင့် Note တွင်ကျ မှတ်သားရာတွင် အထူး ကောင်းမွန်သည်။ ကြီးသောမျက်နှာပြင် ကြောင့် second monitor အဖြစ် အလွန် အဆင်ပြေသည်။</p>

<h2>၂။ BOOX Go 10.3 — သက်သာသောစျေးနှင့် ကြီးသောမျက်နှာပြင်</h2>
<ul>
  <li>စျေးနှုန်း — 1,806,000 MMK</li>
  <li>မျက်နှာပြင် — 10.3" E Ink Carta 1200</li>
  <li>Resolution — 300 PPI</li>
  <li>အလေးချိန် — ပေါ့ပါး</li>
</ul>
<p>Color မလိုအပ်ဘဲ Monochrome document reading နှင့် code review ပြုလုပ်ရာတွင် ပြီးပြည့်စုံသည်။ Note Air 5C ထက် သက်သာပြီး ထိုသို့ပင် ကောင်းမွန်သော ဖတ်ရှုမှု အတွေ့အကြုံကို ပေးနိုင်သည်။</p>

<h2>Second Monitor အဖြစ် ချိတ်ဆက်နည်း</h2>
<ul>
  <li><strong>Windows/Mac နှင့်</strong> — BOOX Keyboard/ BOOX Link App ဖြင့် USB-C သို့မဟုတ် WiFi မှတဆင့် ချိတ်ဆက်နိုင်သည်</li>
  <li><strong>Android နှင့်</strong> — Dex Mode ဖြင့် တိုက်ရိုက် ချိတ်ဆက်နိုင်သည်</li>
  <li><strong>Linux နှင့်</strong> — VNC သို့မဟုတ် TRICKY method ဖြင့် ချိတ်ဆက်နိုင်သည်</li>
</ul>

<h2>Second Monitor အဖြစ် သုံးသောအခါ အကောင်းဆုံး use case များ</h2>
<ul>
  <li>Code editor တစ်ဘက်တွင် ဖွင့်ပြီး reference documentation ကို BOOX တွင် ကြည့်ရှုခြင်း</li>
  <li>Email သို့မဟုတ် Slack message ကို BOOX တွင် ဖတ်ရှုပြီး main monitor တွင် အလုပ်ဆက်လုပ်ခြင်း</li>
  <li>PDF ဖတ်ရှုမှုနှင့် တစ်ချိန်တည်း note မှတ်သားခြင်း</li>
  <li>မျက်လုံးပင်ပန်းမှုကို လျှော့ချရန် main monitor မှ E Ink ဘက်သို့ ဖတ်ရှုမှုများ ရွှေ့ပြောင်းခြင်း</li>
</ul>

<h2>နိဂုံးချုပ်</h2>
<p>BOOX device ကို second monitor အဖြစ် အသုံးပြုခြင်းသည် Developer၊ Writer နှင့် Researcher များအတွက် productivity ကို သိသိသာသာ မြင့်တင်ပေးနိုင်သည်။ မြန်မာနိုင်ငံတွင် Bonanza မှ BOOX device အားလုံးကို တရားဝင် ဖြန့်ဝေရောင်းချပေးလျက် ရှိပြီး အာမခံပြုလုပ်ပေးနိုင်သည်။</p>`,
    category: 'Guides',
    featuredImage: '/images/products/go103.png',
    published: true,
    createdAt: new Date('2024-11-05').toISOString(),
  },
  {
    id: 'blog-ghosting-fix-2024',
    title: 'BOOX Color E Ink Tablet တွင် Ghosting Effect ဖြစ်ပါက မည်သို့ ဖြေရှင်းမည်နည်း?',
    excerpt: 'Color E Ink tablet သုံးစဉ် Ghosting effect ဖြစ်ပွားပါက ကြောက်မနေပါနဲ့။ BOOX expert များ၏ အကြံပြုချက်များဖြင့် ဤပြဿနာကို လွယ်ကူစွာ ဖြေရှင်းနိုင်သည်။',
    content: `<h2>Ghosting Effect ဆိုတာ ဘာလဲ?</h2>
<p>Ghosting သည် E Ink မျက်နှာပြင်တွင် ယခင် page ၏ ရုပ်ပုံ သို့မဟုတ် စာသား အကြွင်းအကျန် မြင်ရနေသောအခြေအနေကို ဆိုလိုသည်။ ၎င်းသည် E Ink နည်းပညာ၏ သဘာဝ ဝိသေသတစ်ခုဖြစ်ပြီး Color E Ink (Kaleido) device များတွင် ပိုမို နောက်ဆုံးပေါ်တတ်သည်။</p>

<h2>Ghosting ဖြစ်ရခြင်း အကြောင်းအရင်းများ</h2>
<ul>
  <li>App များသည် E Ink မျက်နှာပြင်အတွက် optimize မပြုလုပ်ထားခြင်း</li>
  <li>Refresh mode မှားယွင်းစွာ သတ်မှတ်ထားခြင်း</li>
  <li>High frame rate animation များ run ခြင်း</li>
  <li>Background app များ မျက်နှာပြင်ကို ဆက်တိုက် update ပြုလုပ်နေခြင်း</li>
</ul>

<h2>Ghosting ဖြေရှင်းနည်းများ</h2>

<h2>၁။ Full Screen Refresh ပြုလုပ်ပါ</h2>
<p>Status bar မှ Full Refresh icon ကို နှိပ်ပါ (သို့မဟုတ်) မျက်နှာပြင်ပေါ်တွင် ၃ ချက် တို့ကြာ ဖိထားပါ။ ၎င်းသည် ghosting ကို ချက်ချင်း ဖယ်ရှားပေးမည်ဖြစ်သည်။</p>

<h2>၂။ Refresh Mode ကို ပြင်ဆင်ပါ</h2>
<p>Settings → Display → Refresh Mode ဝင်ပြီး အောက်ပါ mode များမှ သင့်လျော်သည့်တစ်ခုကို ရွေးချယ်ပါ:</p>
<ul>
  <li><strong>A2 Mode</strong> — အမြန်ဆုံး refresh၊ ghosting အဖြစ်များသည်၊ handwriting/note ရေးရာတွင် သုံးသင့်သည်</li>
  <li><strong>Regal Mode</strong> — A2 နှင့် GC mode ၏ အလယ်အမှတ်၊ web browsing အတွက် သင့်လျော်သည်</li>
  <li><strong>GC Mode (Full Refresh)</strong> — အကောင်းဆုံး display quality၊ ghosting မဖြစ်သော်လည်း နှေးသည်၊ ebook ဖတ်ရာတွင် သုံးသင့်သည်</li>
</ul>

<h2>၃။ App Optimization ပြုလုပ်ပါ</h2>
<p>BOOX device တွင် Control Panel → App Optimization ဝင်ပါ။ ထိုနေရာတွင် app တစ်ခုချင်းစီအတွက် refresh mode ကို သီးခြားသတ်မှတ်နိုင်သည်:</p>
<ul>
  <li>Reading app (Kindle, Moon+ Reader) — GC mode</li>
  <li>Browser — Regal mode</li>
  <li>Note app — A2 mode</li>
  <li>Social media — Regal/GC mode</li>
</ul>

<h2>၄။ Animation ကို ပိတ်ပါ</h2>
<p>Settings → Display → Animation Scale → Animation Off ကို သတ်မှတ်ပါ။ Android system animation များကို ပိတ်ထားခြင်းဖြင့် ghosting ကို သိသိသာသာ လျှော့ချနိုင်သည်။</p>

<h2>၅။ Background App တွေ ပိတ်ပါ</h2>
<p>Background တွင် run နေသော app များသည် E Ink မျက်နှာပြင်ကို ဆက်တိုက် refresh ဖြစ်စေပြီး ghosting ကို ပိုမိုဆိုးရွားစေသည်။ App switcher ဖွင့်ပြီး မလိုအပ်သော app များကို ပိတ်ပါ။</p>

<h2>Color E Ink အတွက် သတိပြုရမည့် အချက်</h2>
<p>BOOX Note Air 5C ကဲ့သို့သော Color E Ink device များသည် Kaleido 3 နည်းပညာကို အသုံးပြုသည်။ Color rendering ကောင်းမွန်ရန် front light ကို medium brightness (40-60%) တွင် ထားပြီး warm light ကို ညောင်းညောင်းထည့်ပြီး ဖတ်ရှုပါ။ ၎င်းသည် color saturation ကို မြင့်တင်ပြီး ghosting ကိုလည်း လျှော့ချပေးသည်။</p>

<h2>နိဂုံးချုပ်</h2>
<p>Ghosting သည် E Ink device ၏ ပုံမှန်ဖြစ်ရပ်တစ်ခုဖြစ်ပြီး မည်သည့် hardware ချို့ယွင်းချက်မျှ မဟုတ်ပါ။ Refresh mode ကို မှန်ကန်စွာ သတ်မှတ်ပြီး app optimization ပြုလုပ်ထားပါက BOOX Color E Ink device ဖြင့် ချောမွေ့ပြောင်ချောင်သော အတွေ့အကြုံကို ရရှိနိုင်သည်။ နောက်ထပ် မေးမြန်းလိုသည်များ ရှိပါက Bonanza မှ ဝန်ဆောင်မှုပေးရန် အသင့်ရှိပါသည်။</p>`,
    category: 'Tips',
    featuredImage: '/images/products/noteair5c.png',
    published: true,
    createdAt: new Date('2024-11-10').toISOString(),
  },
];

async function pushPost(post) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/posts/${post.id}`;
  
  const fields = {};
  for (const [key, val] of Object.entries(post)) {
    if (typeof val === 'string')  fields[key] = { stringValue: val };
    if (typeof val === 'boolean') fields[key] = { booleanValue: val };
  }

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  });

  const data = await res.json();
  if (data.error) throw new Error(`${post.id}: ${JSON.stringify(data.error)}`);
  console.log(`✅ "${post.title.substring(0, 50)}..."`);
}

(async () => {
  console.log('Pushing blog posts to Firebase...\n');
  for (const post of posts) {
    try { await pushPost(post); }
    catch (e) { console.error(`❌ ${e.message}`); }
  }
  console.log('\nDone! 3 posts pushed.');
})();
