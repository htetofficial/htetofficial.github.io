/**
 * Htet Official — Data Loader Layer with Robust JSON/JS Fallback
 * Guarantees zero breakage even on local file:// origin or offline mode.
 * Supports Articles, Posts, Glossary, Publications, and Daily Quotes.
 */
(function() {
  'use strict';

  const STATIC_QUOTES = [
  {
    "quote_mm": "လွတ်လပ်မှုဆိုသည်မှာ မိမိဖြစ်တည်မှုကို သူတစ်ပါးထံ ခွင့်တောင်းနေရခြင်း မဟုတ်။ မိမိကိုယ်မိမိ ရဲဝံ့စွာ သတ်မှတ်ပြဋ္ဌာန်းနိုင်ခြင်း ဖြစ်သည်။",
    "quote_en": "Freedom is not begging others for permission to exist; it is having the courage to define oneself autonomously.",
    "quote_zh": "自由不是向他人祈求存在的许可，而是拥有自主定义自身存在的无畏勇气。",
    "quote_th": "อิสรภาพไม่ใช่การร้องขอความยินยอมจากผู้อื่นเพื่อการมีตัวตน แต่คือความกล้าหาญที่จะนิยามและกำหนดชะตาชีวิตของตนเองอย่างมีศักดิ์ศรี",
    "quote_ja": "自由とは自らの存在許可を他者に乞うことではない。自らの存在を恐れずに自律的に定義する勇気のことである。",
    "topic_mm": "ဖြစ်တည်မှုနှင့် လွတ်လပ်ခွင့်",
    "topic_en": "Existence & Freedom",
    "topic_zh": "存在与自由",
    "topic_th": "การมีตัวตนและอิสรภาพ",
    "topic_ja": "実存と自由",
    "source": "Htet — Philosophical Notes (2025)",
    "source_mm": "ထက် — ဒဿနမှတ်စုများ (၂၀၂၅)",
    "source_en": "Htet — Philosophical Notes (2025)",
    "source_zh": "Htet — 哲学随笔笔记 (2025)",
    "source_th": "Htet — บันทึกเชิงปรัชญา (2025)",
    "source_ja": "Htet — 哲学ノート (2025)"
  },
  {
    "quote_mm": "ဖိနှိပ်မှုအားလုံးသည် ဆုံချက်တစ်ခုတည်းတွင် မရပ်တည်။ လူမျိုး၊ ဂျန်ဒါ၊ လူတန်းစားတို့၏ ဆုံချက်တိုင်းတွင် အားလုံးလွတ်မြောက်မှသာ စစ်မှန်သော တရားမျှတမှု ဖြစ်ထွန်းမည်။",
    "quote_en": "No oppression exists in a vacuum. True justice blooms only when the intersections of race, gender, and class are dismantled together.",
    "quote_zh": "任何压迫都不是孤立存在的。唯有打破种族、性别与阶级交织的枷锁，全人类共同解放，真正的正义方能到来。",
    "quote_th": "การกดขี่ไม่มีวันดำรงอยู่อย่างโดดเดี่ยว ความยุติธรรมที่แท้จริงจะผลิบานได้ก็ต่อเมื่อการรื้อถอนจุดตัดของการกดขี่ทั้งด้านชาติพันธุ์ เพศสภาพ และชนชั้นดำเนินไปพร้อมกันอย่างแท้จริง",
    "quote_ja": "いかなる抑圧も孤立しては存在しない。人種、ジェンダー、階級が交差するすべての構造が解体されてこそ、真の正義が息吹く。",
    "topic_mm": "ဆုံချက်ပေါင်းစုံ တရားမျှတမှု",
    "topic_en": "Intersectional Justice",
    "topic_zh": "交叉性正义",
    "topic_th": "ความยุติธรรมเชิงจุดตัดซ้อนทับ",
    "topic_ja": "交差的正義（インターセクショナリティ）",
    "source": "Htet — Essay on Intersectionality",
    "source_mm": "ထက် — ဆုံချက်ပေါင်းစုံ သီအိုရီ စာတမ်း",
    "source_en": "Htet — Essay on Intersectionality",
    "source_zh": "Htet — 交叉性社会理论论著",
    "source_th": "Htet — เรียงความว่าด้วยจุดตัดซ้อนทับของการกดขี่",
    "source_ja": "Htet — 交差性理論に関する論考"
  },
  {
    "quote_mm": "ခန္ဓာကိုယ်သည် နိုင်ငံတော်၏ စည်းကမ်းသတ်မှတ်ရန် နယ်မြေမဟုတ်။ ကိုယ်ပိုင်အချုပ်အခြာအာဏာ တည်တံ့ရာ အမြင့်မြတ်ဆုံး လွတ်လပ်နယ်မြေ ဖြစ်သည်။",
    "quote_en": "The body is not an administrative territory for state discipline; it is the sacred home of absolute bodily autonomy.",
    "quote_zh": "身体绝非国家强加规训的从属疆域，而是个体主权永恒伫立的最神圣自由领域。",
    "quote_th": "ร่างกายมิใช่อาณาเขตที่รัฐจะเข้ามาจัดระเบียบหรือบงการ หากแต่เป็นดินแดนแห่งเสรีภาพอันศักดิ์สิทธิ์สูงสุดแห่งอำนาจอธิปไตยเหนือเนื้อตัวร่างกายของตนเอง",
    "quote_ja": "身体は国家が規律を課すための行政領土ではない。個人の絶対的身体的主権が息づく最も神聖な自由の聖域である。",
    "topic_mm": "ခန္ဓာကိုယ် နိုင်ငံရေး",
    "topic_en": "Bodily Autonomy",
    "topic_zh": "身体自主与政治",
    "topic_th": "สิทธิและอำนาจอธิปไตยเหนือเนื้อตัวร่างกาย",
    "topic_ja": "身体の自律と身体政治",
    "source": "Htet — Trans Rights Monograph",
    "source_mm": "ထက် — Trans အခွင့်အရေး စာတမ်း",
    "source_en": "Htet — Trans Rights Monograph",
    "source_zh": "Htet — 跨性别权利专题论著",
    "source_th": "Htet — บทความวิชาการว่าด้วยสิทธิคนข้ามเพศ",
    "source_ja": "Htet — トランスジェンダーの権利に関する論考"
  },
  {
    "quote_mm": "အကြမ်းဖက်သော စနစ်များကို နောက်ထပ် ဒဏ်ခတ်မှုများဖြင့် မဖြေရှင်းနိုင်။ စစ်မှန်သော လုံခြုံရေးသည် အချင်းချင်း အပြန်အလှန် စောင့်ရှောက်မှု (Community Care) ဖြင့်သာ ရနိုင်မည်။",
    "quote_en": "Violence cannot be cured with carceral retribution. Genuine community safety emerges from radical care and transformative solidarity.",
    "quote_zh": "暴力的结构绝无法通过更多的报复性惩罚得到疗愈。真正切实的群体安全，唯有源自深刻的互助关怀与变革性团结。",
    "quote_th": "โครงสร้างความรุนแรงไม่อาจเยียวยาได้ด้วยการลงทัณฑ์ซ้ำเติม ความปลอดภัยของชุมชนที่แท้จริงเกิดจากการดูแลซึ่งกันและกันอย่างลึกซึ้งและความเป็นน้ำหนึ่งใจเดียวกันที่นำไปสู่การเปลี่ยนแปลง",
    "quote_ja": "暴力的な構造は懲罰の報復によって癒やすことはできない。真の共同体の安全は、相互扶助のケアと変革的連帯からのみ生まれる。",
    "topic_mm": "ပြုပြင်ကုစားသော တရားမျှတမှု",
    "topic_en": "Transformative Justice",
    "topic_zh": "转化性正义与社区关怀",
    "topic_th": "ความยุติธรรมเชิงสมานฉันท์และการแปรสภาพ",
    "topic_ja": "変革的正義とコミュニティ・ケア",
    "source": "Htet — Grassroots Solidarity Notes",
    "source_mm": "ထက် — အခြေခံလူထု စည်းလုံးညီညွတ်ရေး မှတ်စုများ",
    "source_en": "Htet — Grassroots Solidarity Notes",
    "source_zh": "Htet — 基层草根连带笔记",
    "source_th": "Htet — บันทึกความสมานฉันท์ภาคประชาชนระดับรากหญ้า",
    "source_ja": "Htet — 草の根連帯ノート"
  },
  {
    "quote_mm": "ဝေဖန်ပိုင်းခြားသော အတွေးအခေါ် (Critical Thinking) သည် အာဏာရှင်တိုင်း အကြောက်ဆုံး လက်နက် ဖြစ်သည်။ မေးခွန်းထုတ်နိုင်စွမ်းကို မည်သူ့ကိုမျှ မပေးအပ်လိုက်ပါနှင့်။",
    "quote_en": "Critical thinking is the weapon every authoritarian fears most. Never surrender your right to question dogma.",
    "quote_zh": "批判性思维是一切专制独裁者最深重恐惧的武器。永远不要向任何人让渡你质疑教条与权力的权利。",
    "quote_th": "การคิดเชิงวิพากษ์คืออาวุธที่เผด็จการทุกคนหวาดกลัวที่สุด จงอย่าสละสิทธิ์ในการตั้งคำถามต่อความงมงายและอำนาจนิยมให้แก่ผู้ใดเด็ดขาด",
    "quote_ja": "批判的思考（クリティカル・シンキング）こそ、あらゆる独裁者が最も恐れる武器である。ドグマを疑い問う権利を決して誰にも明け渡してはならない。",
    "topic_mm": "ဝေဖန်ရေးအတွေးအခေါ်",
    "topic_en": "Critical Thinking",
    "topic_zh": "批判性思维与思辨",
    "topic_th": "การคิดเชิงวิพากษ์",
    "topic_ja": "批判的思考（クリティカル・シンキング）",
    "source": "Htet — Youth Political Dialogue",
    "source_mm": "ထက် — လူငယ်နိုင်ငံရေး ဆွေးနွေးပွဲ မှတ်စု",
    "source_en": "Htet — Youth Political Dialogue",
    "source_zh": "Htet — 青年政治对话记录",
    "source_th": "Htet — บทสนทนาทางการเมืองของคนรุ่นใหม่",
    "source_ja": "Htet — ユース政治対話録"
  },
  {
    "quote_mm": "ကလေးတစ်ယောက်၊ ဆရာတစ်ယောက်၊ စာအုပ်တစ်အုပ်နဲ့ ဘောပင်တစ်ချောင်းဟာ ကမ္ဘာကြီးကို ပြောင်းလဲပစ်နိုင်ပါတယ်။",
    "quote_en": "One child, one teacher, one book, one pen can change the world.",
    "quote_zh": "一个孩子、一位老师、一本书和一支笔，就能改变整个世界。",
    "quote_th": "เด็กหนึ่งคน ครูหนึ่งท่าน หนังสือหนึ่งเล่ม และปากกาหนึ่งด้าม สามารถเปลี่ยนโลกทั้งใบได้",
    "quote_ja": "一人の子ども、一人の教師、一冊の本、一本のペンが世界を変えることができる。",
    "topic_mm": "ပညာရေးနှင့် လွတ်မြောက်မှု",
    "topic_en": "Education & Emancipation",
    "topic_zh": "教育与解放",
    "topic_th": "การศึกษาและการปลดแอก",
    "topic_ja": "教育と解放",
    "source": "Malala Yousafzai (မာလာလာ ယူဆွဖ်ဇိုင်း) — ၂၀၁၄ ငြိမ်းချမ်းရေး နိုဘယ်လ်ဆုရှင်",
    "source_mm": "မာလာလာ ယူဆွဖ်ဇိုင်း — ၂၀၁၄ ငြိမ်းချမ်းရေး နိုဘယ်လ်ဆုရှင်",
    "source_en": "Malala Yousafzai — 2014 Nobel Peace Prize Laureate",
    "source_zh": "马拉拉·尤萨夫扎伊 — 2014年诺贝尔和平奖得主",
    "source_th": "มาลาลา ยูซาฟไซ — ผู้ได้รับรางวัลโนเบลสาขาสันติภาพปี 2014",
    "source_ja": "マララ・ユスフザイ — 2014年ノーベル平和賞受賞者"
  },
  {
    "quote_mm": "လောကကြီးတွင် အမှန်တရားနှင့် တရားမျှတမှုအတွက် တိုက်ပွဲဝင်ခြင်းထက် ပိုမိုလှပပြီး မြင့်မြတ်သောအရာ မရှိ။",
    "quote_en": "There is nothing more beautiful or noble in the world than fighting for truth and justice.",
    "quote_zh": "世间再没有任何事物，比为了真理与正义而奋斗更加崇高壮美。",
    "quote_th": "ในโลกนี้ไม่มีสิ่งใดงดงามและสูงส่งยิ่งไปกว่าการต่อสู้เพื่อความจริงและความยุติธรรม",
    "quote_ja": "この世において、真理と正義のために闘うことほど美しく気高い営みはない。",
    "topic_mm": "တော်လှန်ရေးနှင့် ရဲရင့်မှု",
    "topic_en": "Revolution & Courage",
    "topic_zh": "革命与勇气",
    "topic_th": "การปฏิวัติและความกล้าหาญ",
    "topic_ja": "革命と勇気",
    "source": "Helen Keller (ဟယ်လင် ကဲလား) — တော်လှန်သော ဆိုရှယ်လစ် စာရေးဆရာမ",
    "source_mm": "ဟယ်လင် ကဲလား — တော်လှန်သော ဆိုရှယ်လစ် စာရေးဆရာမ",
    "source_en": "Helen Keller — Revolutionary Socialist & Author",
    "source_zh": "海伦·凯勒 — 革命社会主义作家与社会活动家",
    "source_th": "เฮเลน เคลเลอร์ — นักเขียนสังคมนิยมปฏิวัติและนักต่อสู้เพื่อสังคม",
    "source_ja": "ヘレン・ケラー — 革命的社会主義作家・活動家"
  },
  {
    "quote_mm": "လွတ်လပ်ရေးရပြီးလို့ စီမံကိန်းအမျိုးမျိုး လုပ်တဲ့အခါမှာတောင် အနည်းဆုံး အနှစ် ၂၀ လောက် အလုပ်လုပ်ရမယ်။ ပွင့်ပွင့်လင်းလင်း ပြောရရင် ပွင့်ပွင့်လင်းလင်းပြောတာကို လူတွေ ပိုမှတ်မိလွယ်လို့... ပွင့်ပွင့်လင်းလင်းပြောရရင် ဖင်ပြဲအောင် အလုပ်လုပ်ပြီး ကြိုးစားရမယ်၊ ဒါမှသာ နောက်အနှစ် ၂၀ လောက်မှာ ကျွန်တော်တို့ နောက်ကောက်ကျမကျန်ရစ်မှာ ဖြစ်တယ်။ ခင်ဗျားတို့ အလုပ်မလုပ်ရင် ထိုင်းနိုင်ငံကို မှီနိုင်မှာ မဟုတ်ဘူး... တိုင်းရင်းသားတွေနဲ့ နိုင်ငံသားတွေကြားမှာ စည်းလုံးညီညွတ်မှု မရှိသရွေ့ ဒီနိုင်ငံ လွတ်လပ်ရေးရတယ်ဆိုဦးတော့ ဘယ်ပါတီ၊ ဘယ်အစိုးရ တက်တက် ကျွန်တော်တို့နိုင်ငံက ပြည့်တန်ဆာနိုင်ငံအဖြစ်ပဲ ဆက်ရှိနေလိမ့်မယ်။",
    "quote_en": "Even after independence, when undertaking various reconstruction plans, we must work relentlessly for at least twenty years. To speak candidly—because candid words stick best in people's minds—we must work our fingers to the bone, or in twenty years we will be left hopelessly behind. If you do not work, you will never catch up with Thailand... Furthermore, unless there is genuine unity between all ethnic nationalities and citizens, even if this country gains independence, no matter which party or government takes power, our nation will remain nothing more than a prostitute nation.",
    "quote_zh": "独立之后，即便推行各种建设计划，我们至少也必须奋斗二十年。坦率地讲——因为直言最易入心——我们必须拼尽全力、埋头苦干，唯有如此，二十年后我们才不至于被时代彻底抛弃。如果不努力，甚至连泰国都赶不上……更重要的是，只要各族人民与公民之间没有真正的团结，即便国家赢得独立，无论哪个政党、哪届政府执政，我们国家终究不过是一个任人蹂躏摆布的国家。",
    "quote_th": "แม้หลังจากได้รับเอกราชแล้ว ในการดำเนินแผนงานฟื้นฟูต่างๆ เรายังต้องทำงานหนักอย่างน้อยอีกยี่สิบปี หากพูดกันตรงๆ—เพราะคำพูดที่ตรงไปตรงมานั้นผู้คนจำได้ง่ายที่สุด—เราต้องทำงานหนักสายตัวแทบขาด มิฉะนั้นในอีกยี่สิบปีข้างหน้าเราจะถูกทิ้งไว้ข้างหลังอย่างสิ้นหวัง หากท่านไม่ทำงาน ย่อมไม่มีทางตามทันแม้กระทั่งประเทศไทย... และที่สำคัญที่สุด ตราบใดที่ไร้ซึ่งความสามัคคีเป็นอันหนึ่งอันเดียวกันระหว่างชนชาติพันธุ์และประชาชนทั้งปวง แม้ประเทศนี้จะได้เอกราช ไม่ว่าพรรคไหนหรือรัฐบาลใดจะขึ้นมาปกครอง ชาติของเราก็จะเป็นได้เพียงแค่ 'ประเทศโสเภณี' ที่ถูกเอารัดเอาเปรียบเท่านั้น",
    "quote_ja": "独立を果たしたとしても、各種の復興計画を実行するには少なくとも20年はがむしゃらに働かねばならない。率直に言えば――率直な言葉こそ人々の記憶に最も強く残るからだ――身を粉にして徹底的に働き努力しなければ、20年後に我々は完全に取り残されてしまうだろう。諸君が働かなければタイに追いつくことすらできない……さらに、各民族と国民の間に真の結束と連帯がない限り、この国が独立を迎えたとしても、いかなる政党や政府が政権を握ろうとも、我が国は他国に搾取されるだけの『娼婦国家』のままであり続けるだろう。",
    "topic_mm": "နိုင်ငံတော်ပြန်လည်ထူထောင်ရေးနှင့် စည်းလုံးညီညွတ်မှု",
    "topic_en": "National Reconstruction & Sovereign Unity",
    "topic_zh": "国家重建与主权团结",
    "topic_th": "การฟื้นฟูชาติและความสามัคคี",
    "topic_ja": "国家再建と主権的連帯",
    "source": "General Aung San (ဗိုလ်ချုပ်အောင်ဆန်း) — ၁၉၄၇ သမိုင်းဝင်မိန့်ခွန်း",
    "source_mm": "ဗိုလ်ချုပ်အောင်ဆန်း — ၁၉၄၇ ခုနှစ် သမိုင်းဝင်မိန့်ခွန်း",
    "source_en": "General Aung San — Historic Address (1947)",
    "source_zh": "昂山将军 — 1947年历史性演讲",
    "source_th": "นายพลอองซาน — สุนทรพจน์ประวัติศาสตร์ (1947)",
    "source_ja": "アウンサン将軍 — 1947年歴史的演説"
  },
  {
    "quote_mm": "သူက Plato ကို quote လုပ်နိုင်ပြီး short skirt (စကတ်တို) ဝတ်နိုင်တာပဲ၊ why not? လူတစ်ယောက်ရဲ့ ပညာရပ်ဆိုင်ရာ အရည်အချင်းနဲ့ သူ့ရဲ့ ဝတ်စားဆင်ယင်မှုက တိုက်ရိုက် correlate မဖြစ်သင့်ဘူး။ John Stuart Mill ရဲ့ Harm Principle အရ တခြားသူကို မထိခိုက်မချင်း ဒါဟာ သူ့ရဲ့ personal expression နဲ့ agency (ကိုယ်ပိုင်ဆုံးဖြတ်ခွင့်) ပဲ ဖြစ်ပါတယ်။",
    "quote_en": "One can quote Plato while wearing a short skirt—why on earth not? Academic competence must never be correlated with personal attire. Under Mill's Harm Principle, as long as an action harms no other, bodily expression is an unassailable manifestation of human agency.",
    "quote_zh": "一个人完全可以一边身穿短裙，一边引述柏拉图的典故——有何不可？个体的学术素养与专业能力绝不应当与其着装打扮挂钩。正如密尔的‘伤害原则’所言，只要没有直接伤害他人，个体的身体表达就是不可剥夺的主体能动性（Agency）。",
    "quote_th": "คนเราสามารถอ้างอิงเพลโต (Plato) ไปพร้อมกับการใส่กระโปรงสั้นได้—ทำไมจะไม่ได้ล่ะ? ความสามารถทางวิชาการและวิชาชีพของมนุษย์ไม่ควรถูกผูกโยงเข้ากับเครื่องแต่งกาย ตามหลักการไม่สร้างอันตรายต่อผู้อื่น (Harm Principle) ของ จอห์น สจ๊วต มิลล์ ตราบใดที่ไม่ทำร้ายใคร การแสดงออกทางร่างกายย่อมเป็นเจตจำนงเสรีและอำนาจการตัดสินใจของตนเอง (Agency)",
    "quote_ja": "ミニスカートを履きながらプラトンを引用したって構わない、なぜ駄目なのか？ 人間の学問的・専門的能力は、決して身に纏う衣服と相関して判断されるべきではない。J・S・ミルの危害原則が示す通り、他者を直接害しない限り、自らの身体表現は侵すべからざる主体的主体性（エージェンシー）の行使である。",
    "topic_mm": "ဝတ်စားဆင်ယင်မှု၊ ပညာစွမ်းရည်နှင့် ကိုယ်ပိုင်ဆုံးဖြတ်ခွင့်",
    "topic_en": "Attire, Competence & Bodily Agency",
    "topic_zh": "着装表达、专业素养与主体能动性",
    "topic_th": "เครื่องแต่งกาย ศักยภาพทางวิชาการ และเจตจำนงเสรี",
    "topic_ja": "着装表現・学問的能力・主体的決定権",
    "source": "Htet (ထက်) — Women Nation ဒဿနမှတ်စု (၂၀၂၅)",
    "source_mm": "ထက် — Women Nation ဒဿနမှတ်စု (၂၀၂၅)",
    "source_en": "Htet — Women Nation Philosophical Notes (2025)",
    "source_zh": "Htet — Women Nation 哲学随笔 (2025)",
    "source_th": "Htet — บันทึกเชิงปรัชญา Women Nation (2025)",
    "source_ja": "Htet — Women Nation 哲学ノート (2025)"
  }
];

  const scriptLoaders = {};
  function loadBackupScript(src) {
    if (scriptLoaders[src]) return scriptLoaders[src];
    scriptLoaders[src] = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
    return scriptLoaders[src];
  }

  const HtetData = {
    /**
     * Fetch all articles with automatic fallback
     * @returns {Promise<Array>}
     */
    async getArticles() {
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        if (!window.HTET_ARTICLES_BACKUP && !window.articlesData) {
          await loadBackupScript('js/data/articles-backup.js');
        }
        return window.HTET_ARTICLES_BACKUP || window.articlesData || [];
      }
      try {
        const response = await fetch('data/articles.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : (window.HTET_ARTICLES_BACKUP || window.articlesData || []);
      } catch (err) {
        console.warn('[HtetData] fetch(data/articles.json) fallback triggered.', err);
        if (!window.HTET_ARTICLES_BACKUP && !window.articlesData) {
          await loadBackupScript('js/data/articles-backup.js');
        }
        return window.HTET_ARTICLES_BACKUP || window.articlesData || [];
      }
    },

    /**
     * Get a specific article by ID or slug
     * @param {string} idOrSlug
     * @returns {Promise<Object|null>}
     */
    async getArticleById(idOrSlug) {
      const articles = await this.getArticles();
      if (!idOrSlug) return null;
      const lower = String(idOrSlug).toLowerCase().trim();
      return articles.find(a => 
        (a.id && a.id.toLowerCase() === lower) || 
        (a.slug && a.slug.toLowerCase() === lower)
      ) || null;
    },

    /**
     * Fetch micro-blog & activism posts with fallback
     * @returns {Promise<Array>}
     */
    async getPosts() {
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        if (!window.HTET_POSTS_BACKUP && !window.postsData) {
          await loadBackupScript('js/data/posts-backup.js');
        }
        return window.HTET_POSTS_BACKUP || window.postsData || [];
      }
      try {
        const response = await fetch('data/posts.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : (window.HTET_POSTS_BACKUP || window.postsData || []);
      } catch (err) {
        console.warn('[HtetData] fetch(data/posts.json) fallback triggered.', err);
        if (!window.HTET_POSTS_BACKUP && !window.postsData) {
          await loadBackupScript('js/data/posts-backup.js');
        }
        return window.HTET_POSTS_BACKUP || window.postsData || [];
      }
    },

    /**
     * Fetch conceptual glossary with fallback
     * @returns {Promise<Array>}
     */
    async getGlossary() {
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        if (!window.HTET_GLOSSARY_BACKUP) {
          await loadBackupScript('js/data/glossary-backup.js');
        }
        return window.HTET_GLOSSARY_BACKUP || [];
      }
      try {
        const response = await fetch('data/glossary.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : (window.HTET_GLOSSARY_BACKUP || []);
      } catch (err) {
        console.warn('[HtetData] fetch(data/glossary.json) fallback triggered.', err);
        if (!window.HTET_GLOSSARY_BACKUP) {
          await loadBackupScript('js/data/glossary-backup.js');
        }
        return window.HTET_GLOSSARY_BACKUP || [];
      }
    },

    /**
     * Fetch academic publications & zines with fallback
     * @returns {Promise<Array>}
     */
    async getPublications() {
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        if (!window.HTET_PUBLICATIONS_BACKUP && !window.publicationsData && !window.HtetPublicationsBackup) {
          await loadBackupScript('js/data/publications-backup.js');
        }
        return window.HTET_PUBLICATIONS_BACKUP || window.publicationsData || window.HtetPublicationsBackup || [];
      }
      try {
        const response = await fetch('data/publications.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return (Array.isArray(data) && data.length > 0) ? data : (window.HTET_PUBLICATIONS_BACKUP || window.publicationsData || window.HtetPublicationsBackup || []);
      } catch (err) {
        console.warn('[HtetData] fetch(data/publications.json) fallback triggered.', err);
        if (!window.HTET_PUBLICATIONS_BACKUP && !window.publicationsData && !window.HtetPublicationsBackup) {
          await loadBackupScript('js/data/publications-backup.js');
        }
        return window.HTET_PUBLICATIONS_BACKUP || window.publicationsData || window.HtetPublicationsBackup || [];
      }
    },

    /**
     * Fetch authored books & long-form educational publications with fallback
     * @returns {Promise<Array>}
     */
    async getBooks() {
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        if (!window.HTET_BOOKS_BACKUP && !window.booksData) {
          await loadBackupScript('js/data/books-backup.js');
        }
        return window.HTET_BOOKS_BACKUP || window.booksData || [];
      }
      try {
        const response = await fetch('data/books.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : (window.HTET_BOOKS_BACKUP || window.booksData || []);
      } catch (err) {
        console.warn('[HtetData] fetch(data/books.json) fallback triggered.', err);
        if (!window.HTET_BOOKS_BACKUP && !window.booksData) {
          await loadBackupScript('js/data/books-backup.js');
        }
        return window.HTET_BOOKS_BACKUP || window.booksData || [];
      }
    },

    /**
     * Get philosophical daily quotes
     * @returns {Array}
     */
    getQuotes() {
      if (window.HTET_QUOTES_BACKUP && window.HTET_QUOTES_BACKUP.length > 0) {
        return window.HTET_QUOTES_BACKUP;
      }
      // If not loaded yet, lazily trigger backup script in background
      if (typeof window !== 'undefined' && !window.HTET_QUOTES_BACKUP) {
        loadBackupScript('js/data/quotes-backup.js');
      }
      return STATIC_QUOTES;
    }
  };

  window.HtetData = HtetData;
})();
