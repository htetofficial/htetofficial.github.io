#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys

def main():
    with open('technology.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add PassThru Sponsor Banner under Quick Metrics in Hero
    hero_target = '      </div>\n    </header>\n\n    <!-- SECTION 01: AUDIO & NEURAL SPEECH SYNTHESIS STACK -->'
    
    hero_replacement = '''      </div>

      <!-- PassThru VPN Sponsor Spotlight Capsule -->
      <div class="mt-8 p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-cream/80 to-vermilion/10 dark:from-amber-500/15 dark:via-stone-900/60 dark:to-vermilion/15 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div class="flex items-start sm:items-center space-x-3.5 min-w-0">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-vermilion text-white flex items-center justify-center shrink-0 shadow-md">
            <i class="ri-shield-keyhole-line text-2xl"></i>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-0.5">
              <span class="font-bold text-base text-charcoal font-serif-editorial">PassThru VPN</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold uppercase">Official Development Sponsor</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cream text-muted">Unlimited Devices • 10+ Global Servers</span>
            </div>
            <p class="text-xs text-muted leading-relaxed font-sans-ui" data-mm="မြန်မာနိုင်ငံ၏ ဆင်ဆာအတားအဆီးများကြားမှ ဤဝက်ဘ်ဆိုက်နှင့် AI Voice Model များ တည်ဆောက်ရေးအတွက် High-Speed VPN ချိတ်ဆက်မှုကို အပြည့်အဝ ပံ့ပိုးပေးခဲ့သည့် မိတ်ဖက်" data-en="Official Connectivity Partner empowering high-speed AI voice research & development across Myanmar's restricted networks">
              မြန်မာနိုင်ငံ၏ ဆင်ဆာအတားအဆီးများကြားမှ ဤဝက်ဘ်ဆိုက်နှင့် AI Voice Model များ တည်ဆောက်ရေးအတွက် High-Speed VPN ချိတ်ဆက်မှုကို အပြည့်အဝ ပံ့ပိုးပေးခဲ့သည့် မိတ်ဖက်
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
          <a href="#passthru-vpn" class="px-4 py-2 rounded-full bg-vermilion text-white text-xs font-medium hover:bg-vermilion-hover transition-all flex items-center space-x-1.5 shadow-xs">
            <i class="ri-eye-line text-xs"></i>
            <span data-mm="သုံးသပ်ချက်နှင့် ဝန်ဆောင်မှု ကြည့်ရန်" data-en="View Review & Packages">သုံးသပ်ချက်နှင့် ဝန်ဆောင်မှု ကြည့်ရန်</span>
          </a>
        </div>
      </div>
    </header>

    <!-- SECTION 01: AUDIO & NEURAL SPEECH SYNTHESIS STACK -->'''

    if hero_target in html:
        html = html.replace(hero_target, hero_replacement, 1)
        print("✓ Hero banner injected successfully")
    else:
        print("✗ Hero target not found")
        sys.exit(1)

    # 2. Insert Section 08: PassThru VPN and renumber Section 08 to Section 09
    sec_target = '    <!-- SECTION 08: COMPLETE MASTER INVENTORY TABLE -->\n    <section class="mb-14" aria-labelledby="inventory-heading">\n      <div class="flex items-center space-x-3 mb-8 pb-3 border-b border-hairline">\n        <div class="w-10 h-10 rounded-2xl bg-vermilion/10 text-vermilion flex items-center justify-center font-bold text-lg">08</div>'

    sec_replacement = '''    <!-- SECTION 08: SPECIAL CONNECTIVITY SPONSOR & INFRASTRUCTURE ENABLER — PASSTHRU VPN -->
    <section id="passthru-vpn" class="mb-16 sm:mb-24 scroll-mt-24" aria-labelledby="passthru-heading">
      <div class="flex items-center space-x-3 mb-8 pb-3 border-b border-hairline">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-vermilion/20 text-vermilion flex items-center justify-center font-bold text-lg">08</div>
        <div>
          <div class="flex items-center space-x-2">
            <h2 id="passthru-heading" class="text-2xl sm:text-3xl font-serif-editorial font-bold text-charcoal" data-mm="PassThru VPN — ဝက်ဘ်ဆိုက်တည်ဆောက်ရေး အထူးပံ့ပိုးသူ (Official Development Sponsor &amp; Review)" data-en="PassThru VPN — Official Connectivity Sponsor &amp; Technical Review">
              PassThru VPN — ဝက်ဘ်ဆိုက်တည်ဆောက်ရေး အထူးပံ့ပိုးသူ (Official Development Sponsor &amp; Review)
            </h2>
            <span class="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-semibold">INFRASTRUCTURE SPONSOR</span>
          </div>
          <p class="text-xs sm:text-sm text-muted font-sans-ui mt-0.5" data-mm="မြန်မာနိုင်ငံ၏ အင်တာနက်ဆင်ဆာများကြားမှ ဤဝက်ဘ်ဆိုက်အား အောင်မြင်စွာ တည်ဆောက်နိုင်ရန် လိုအပ်သည့် High-Speed VPN ချိတ်ဆက်မှုကို အပြည့်အဝ ပံ့ပိုးပေးခဲ့သည့် ကျေးဇူးတင်လွှာ၊ နည်းပညာသုံးသပ်ချက်နှင့် ဝန်ဆောင်မှု အစီအစဉ်များ" data-en="Special gratitude, honest technical review, and official package directory for the censorship-resilient VPN service that powered this platform's development.">
            မြန်မာနိုင်ငံ၏ အင်တာနက်ဆင်ဆာများကြားမှ ဤဝက်ဘ်ဆိုက်အား အောင်မြင်စွာ တည်ဆောက်နိုင်ရန် လိုအပ်သည့် High-Speed VPN ချိတ်ဆက်မှုကို အပြည့်အဝ ပံ့ပိုးပေးခဲ့သည့် ကျေးဇူးတင်လွှာ၊ နည်းပညာသုံးသပ်ချက်နှင့် ဝန်ဆောင်မှု အစီအစဉ်များ
          </p>
        </div>
      </div>

      <!-- Part 1: Official Sponsor Gratitude & Acknowledgment Callout -->
      <div class="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-cream/60 to-amber-500/10 dark:from-amber-500/10 dark:via-stone-900/40 dark:to-stone-900/60 shadow-sm mb-10 relative overflow-hidden">
        <div class="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div class="space-y-3 max-w-3xl">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-mono font-semibold">
              <i class="ri-heart-pulse-line text-sm"></i>
              <span data-mm="အထူးကျေးဇူးတင်လွှာ မှတ်တမ်း" data-en="SPECIAL SPONSOR ACKNOWLEDGMENT">အထူးကျေးဇူးတင်လွှာ မှတ်တမ်း</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-serif-editorial font-bold text-charcoal leading-snug" data-mm="မြန်မာနိုင်ငံတွင်းမှ ခေတ်မီနည်းပညာများ ချိတ်ဆက်တည်ဆောက်နိုင်ခဲ့ခြင်းအတွက် ကျေးဇူးစကား" data-en="Gratitude for Empowering Open Research &amp; AI Engineering Under Restrictions">
              မြန်မာနိုင်ငံတွင်းမှ ခေတ်မီနည်းပညာများ ချိတ်ဆက်တည်ဆောက်နိုင်ခဲ့ခြင်းအတွက် ကျေးဇူးစကား
            </h3>
            <p class="text-xs sm:text-sm text-charcoal/90 dark:text-[#E2D8CB] leading-relaxed font-sans-ui" data-mm="ထက် (Htet Official) ပလက်ဖောင်းတစ်ခုလုံးအား တည်ဆောက်ခြင်း၊ အရွယ်အစားကြီးမားသော နိုင်ငံတကာ အသံထွက်မော်ဒယ်များ (Kokoro-82M, ONNX Runtime Web) နှင့် မြန်မာစာ NLP ဝေါဟာရဒေတာဘေ့စ်ပေါင်း ၁၁၁,၂၃၂ ကျော်အား ရှာဖွေရယူခြင်း၊ ဆင်ဆာအတားအဆီးများကြားမှ GitHub၊ Cloudflare R2 နှင့် Vercel Edge သို့ တိုက်ရိုက် Deploy ပြုလုပ်ခြင်း စသည့် အဆင့်တိုင်းတွင် အချိန်ပြည့် တည်ငြိမ်မြန်ဆန်သော High-Speed VPN ချိတ်ဆက်မှုကို PassThru VPN မှ အထူးမေတ္တာဖြင့် အပြည့်အဝ ပံ့ပိုးပေးခဲ့ပါသောကြောင့် အထူးပင် ကျေးဇူးတင်ရှိကြောင်း ဂုဏ်ယူစွာ မှတ်တမ်းတင်အပ်ပါသည်။" data-en="Throughout the research, neural speech architecture synthesis (Kokoro-82M, ONNX Runtime), lexical data synchronization (111K+ Ornagai corpus), and global multi-edge deployment (GitHub, Cloudflare R2, Vercel), PassThru VPN graciously provided the uninterrupted, high-bandwidth tunneling essential to operate from within Myanmar's restricted digital landscape. We honor and thank PassThru VPN for enabling this work.">
              ထက် (Htet Official) ပလက်ဖောင်းတစ်ခုလုံးအား တည်ဆောက်ခြင်း၊ အရွယ်အစားကြီးမားသော နိုင်ငံတကာ အသံထွက်မော်ဒယ်များ (Kokoro-82M, ONNX Runtime Web) နှင့် မြန်မာစာ NLP ဝေါဟာရဒေတာဘေ့စ်ပေါင်း ၁၁၁,၂၃၂ ကျော်အား ရှာဖွေရယူခြင်း၊ ဆင်ဆာအတားအဆီးများကြားမှ GitHub၊ Cloudflare R2 နှင့် Vercel Edge သို့ တိုက်ရိုက် Deploy ပြုလုပ်ခြင်း စသည့် အဆင့်တိုင်းတွင် အချိန်ပြည့် တည်ငြိမ်မြန်ဆန်သော High-Speed VPN ချိတ်ဆက်မှုကို PassThru VPN မှ အထူးမေတ္တာဖြင့် အပြည့်အဝ ပံ့ပိုးပေးခဲ့ပါသောကြောင့် အထူးပင် ကျေးဇူးတင်ရှိကြောင်း ဂုဏ်ယူစွာ မှတ်တမ်းတင်အပ်ပါသည်။
            </p>
          </div>

          <div class="shrink-0 p-4 rounded-2xl bg-card border border-hairline text-center shadow-xs w-full md:w-auto">
            <div class="text-3xl font-serif-editorial font-bold text-amber-600 mb-1">PassThru</div>
            <div class="text-[10px] font-mono text-muted uppercase tracking-wider mb-3">Verified Connectivity</div>
            <a href="https://t.me/PassThruAppBot" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-vermilion text-white font-medium text-xs shadow-xs hover:bg-vermilion-hover transition-all">
              <i class="ri-telegram-fill"></i>
              <span>Bot ဖြင့် ဝယ်ယူရန်</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Part 2: Honest Technical Review by Htet (သုတေသီနှင့် Developer သုံးသပ်ချက်) -->
      <div class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <i class="ri-feedback-line text-vermilion"></i>
            <h3 class="font-serif-editorial font-bold text-lg sm:text-xl text-charcoal" data-mm="ထက် (Htet) ၏ ကိုယ်တွေ့ သုံးသပ်ချက် (Researcher &amp; Developer Review)" data-en="Honest Technical Review by Htet">
              ထက် (Htet) ၏ ကိုယ်တွေ့ သုံးသပ်ချက် (Researcher &amp; Developer Review)
            </h3>
          </div>
          <div class="flex items-center space-x-1 text-amber-500 text-sm">
            <i class="ri-star-fill"></i>
            <i class="ri-star-fill"></i>
            <i class="ri-star-fill"></i>
            <i class="ri-star-fill"></i>
            <i class="ri-star-fill"></i>
            <span class="text-xs font-bold font-mono text-charcoal ml-1">5.0 / 5.0</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Metric 1: Ping & Stability -->
          <div class="p-4 rounded-2xl border border-hairline bg-card shadow-2xs">
            <div class="flex items-center justify-between mb-2">
              <span class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-base">
                <i class="ri-speed-up-line"></i>
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cream text-muted font-semibold">Latency &lt; 40ms</span>
            </div>
            <div class="font-bold text-sm text-charcoal mb-1" data-mm="Ultra-Low Latency Ping" data-en="Ultra-Low Latency Ping">Ultra-Low Latency Ping</div>
            <p class="text-xs text-muted leading-relaxed font-sans-ui" data-mm="Singapore နှင့် အနီးနားနိုင်ငံ ဆာဗာများတွင် Ping အလွန်နိမ့်သောကြောင့် Real-time Web Development နှင့် Git Push/Pull လုပ်ရာတွင် လုံးဝ latency မရှိဘဲ ချောမွေ့ပါသည်။" data-en="Near-zero latency across Singapore &amp; Asian nodes ensures seamless developer productivity and instant edge sync.">
              Singapore နှင့် အနီးနားနိုင်ငံ ဆာဗာများတွင် Ping အလွန်နိမ့်သောကြောင့် Real-time Web Development နှင့် Git Push/Pull လုပ်ရာတွင် လုံးဝ latency မရှိဘဲ ချောမွေ့ပါသည်။
            </p>
          </div>

          <!-- Metric 2: DPI Bypass -->
          <div class="p-4 rounded-2xl border border-hairline bg-card shadow-2xs">
            <div class="flex items-center justify-between mb-2">
              <span class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-base">
                <i class="ri-shield-check-line"></i>
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cream text-muted font-semibold">100% DPI Bypass</span>
            </div>
            <div class="font-bold text-sm text-charcoal mb-1" data-mm="ဆင်ဆာနှင့် Firewall ဖြတ်ကျော်မှု" data-en="Censorship &amp; DPI Resistance">ဆင်ဆာနှင့် Firewall ဖြတ်ကျော်မှု</div>
            <p class="text-xs text-muted leading-relaxed font-sans-ui" data-mm="မြန်မာပြည်တွင်း အင်တာနက်ဆင်ဆာ Deep Packet Inspection (DPI) များကို အပြည့်အဝ ဖြတ်ကျော်နိုင်ပြီး လိုင်းကျခြင်း၊ Block ခံရခြင်းများ မရှိဘဲ တစ်သမတ်တည်း ချိတ်ဆက်နိုင်ပါသည်။" data-en="Flawlessly circumvents Deep Packet Inspection (DPI) firewalls with continuous tunnel persistence and zero unexpected drops.">
              မြန်မာပြည်တွင်း အင်တာနက်ဆင်ဆာ Deep Packet Inspection (DPI) များကို အပြည့်အဝ ဖြတ်ကျော်နိုင်ပြီး လိုင်းကျခြင်း၊ Block ခံရခြင်းများ မရှိဘဲ တစ်သမတ်တည်း ချိတ်ဆက်နိုင်ပါသည်။
            </p>
          </div>

          <!-- Metric 3: Heavy Asset Transfer -->
          <div class="p-4 rounded-2xl border border-hairline bg-card shadow-2xs">
            <div class="flex items-center justify-between mb-2">
              <span class="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-base">
                <i class="ri-download-cloud-2-line"></i>
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cream text-muted font-semibold">High Bandwidth</span>
            </div>
            <div class="font-bold text-sm text-charcoal mb-1" data-mm="AI Model ကြီးများ ဒေါင်းလုဒ်ဆွဲနိုင်မှု" data-en="High-Bandwidth AI Model Downloads">AI Model ကြီးများ ဒေါင်းလုဒ်ဆွဲနိုင်မှု</div>
            <p class="text-xs text-muted leading-relaxed font-sans-ui" data-mm="180MB+ ရှိသော Neural Speech Model ဖိုင်များနှင့် စာအုပ်ကြီးများကို ဒေါင်းလုဒ်ဆွဲရာတွင် Bandwidth အဟန့်အတားမရှိ မြန်ဆန်စွာ ဆွဲယူနိုင်ခဲ့ပါသည်။" data-en="High-throughput pipes allowed uninterrupted acquisition of heavy neural voice models and large archival research sets.">
              180MB+ ရှိသော Neural Speech Model ဖိုင်များနှင့် စာအုပ်ကြီးများကို ဒေါင်းလုဒ်ဆွဲရာတွင် Bandwidth အဟန့်အတားမရှိ မြန်ဆန်စွာ ဆွဲယူနိုင်ခဲ့ပါသည်။
            </p>
          </div>

          <!-- Metric 4: Multi-Device Freedom -->
          <div class="p-4 rounded-2xl border border-hairline bg-card shadow-2xs">
            <div class="flex items-center justify-between mb-2">
              <span class="w-8 h-8 rounded-xl bg-vermilion/10 text-vermilion flex items-center justify-center text-base">
                <i class="ri-devices-line"></i>
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cream text-muted font-semibold">Unlimited Devices</span>
            </div>
            <div class="font-bold text-sm text-charcoal mb-1" data-mm="Device ကန့်သတ်ချက် လုံးဝမရှိခြင်း" data-en="Zero Device Restrictions">Device ကန့်သတ်ချက် လုံးဝမရှိခြင်း</div>
            <p class="text-xs text-muted leading-relaxed font-sans-ui" data-mm="Account တစ်ခုတည်းဖြင့် Laptop၊ Android ဖုန်း၊ iPhone နှင့် Tablet များတွင် စက်အရေအတွက် ကန့်သတ်ချက်မရှိ တစ်ပြိုင်နက် ချိတ်ဆက်သုံးနိုင်ခြင်းမှာ အကြီးမားဆုံး အားသာချက်ဖြစ်ပါသည်။" data-en="A single account connects across Mac, Windows, Android, and iOS simultaneously without arbitrary device caps.">
              Account တစ်ခုတည်းဖြင့် Laptop၊ Android ဖုန်း၊ iPhone နှင့် Tablet များတွင် စက်အရေအတွက် ကန့်သတ်ချက်မရှိ တစ်ပြိုင်နက် ချိတ်ဆက်သုံးနိုင်ခြင်းမှာ အကြီးမားဆုံး အားသာချက်ဖြစ်ပါသည်။
            </p>
          </div>
        </div>
      </div>

      <!-- Part 3: Official Pricing & Packages Directory (ကြော်ငြာနှင့် ဝန်ဆောင်မှု ဈေးနှုန်းများ) -->
      <div class="mb-10">
        <div class="text-center max-w-2xl mx-auto mb-8">
          <span class="text-xs font-mono font-semibold text-vermilion uppercase tracking-wider">OFFICIAL PACKAGES &amp; DIRECTORY</span>
          <h3 class="text-2xl sm:text-3xl font-serif-editorial font-bold text-charcoal mt-1 mb-2" data-mm="PassThru VPN ဝန်ဆောင်မှုနှင့် ဈေးနှုန်းအစီအစဉ်များ" data-en="PassThru VPN Plans &amp; Pricing Architecture">
            PassThru VPN ဝန်ဆောင်မှုနှင့် ဈေးနှုန်းအစီအစဉ်များ
          </h3>
          <p class="text-xs sm:text-sm text-muted font-sans-ui" data-mm="ဝယ်ယူထားသော GB အား သတ်မှတ်သက်တမ်းအတွင်း စိတ်ကြိုက်သုံးစွဲနိုင်ပြီး Device ကန့်သတ်ချက် (လုံးဝ) မရှိပါ" data-en="Full bandwidth allocation usable across unlimited devices within each validity window">
            ဝယ်ယူထားသော GB အား သတ်မှတ်သက်တမ်းအတွင်း စိတ်ကြိုက်သုံးစွဲနိုင်ပြီး Device ကန့်သတ်ချက် (လုံးဝ) မရှိပါ
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 1 Month (30 Days) Panel -->
          <div class="p-6 sm:p-7 rounded-3xl border border-hairline bg-card shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-4 mb-5 border-b border-hairline">
                <div>
                  <span class="text-xs font-mono uppercase text-muted tracking-wider">MONTHLY TIER</span>
                  <h4 class="text-xl font-serif-editorial font-bold text-charcoal flex items-center gap-2">
                    <i class="ri-calendar-line text-blue-500"></i> ၁ လ (ရက် ၃၀) Packages
                  </h4>
                </div>
                <span class="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-semibold">ရက် ၃၀ သက်တမ်း</span>
              </div>

              <!-- Packages List -->
              <div class="space-y-3.5 mb-6">
                <!-- Standard 100GB -->
                <div class="p-4 rounded-2xl border border-hairline hover:border-blue-500/40 bg-cream/30 dark:bg-stone-900/40 transition-all flex items-center justify-between gap-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      🔵
                    </div>
                    <div>
                      <div class="font-bold text-sm text-charcoal flex items-center gap-2">
                        <span>Standard</span>
                        <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-semibold">100 GB</span>
                      </div>
                      <div class="text-[11px] text-muted font-sans-ui">စာဖတ်၊ ဆိုရှယ်မီဒီယာနှင့် သာမန်သုတေသနအတွက်</div>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="font-mono font-bold text-base text-charcoal">4,490 <span class="text-xs font-sans">ကျပ်</span></div>
                    <div class="text-[10px] text-muted font-mono">30 Days</div>
                  </div>
                </div>

                <!-- Premium 200GB (Most Popular) -->
                <div class="p-4 rounded-2xl border-2 border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10 transition-all flex items-center justify-between gap-3 relative shadow-2xs">
                  <span class="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-xs">Most Popular • လူကြိုက်အများဆုံး</span>
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                      🟡
                    </div>
                    <div>
                      <div class="font-bold text-sm text-charcoal flex items-center gap-2">
                        <span>Premium</span>
                        <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">200 GB</span>
                      </div>
                      <div class="text-[11px] text-muted font-sans-ui">ဗီဒီယို၊ ဖိုင်ကြီးများနှင့် နေ့စဉ်ပုံမှန် အသုံးပြုသူများအတွက်</div>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="font-mono font-bold text-base text-amber-700 dark:text-amber-300">7,490 <span class="text-xs font-sans">ကျပ်</span></div>
                    <div class="text-[10px] text-muted font-mono">30 Days</div>
                  </div>
                </div>

                <!-- Premium+ 360GB -->
                <div class="p-4 rounded-2xl border border-hairline hover:border-amber-500/40 bg-cream/30 dark:bg-stone-900/40 transition-all flex items-center justify-between gap-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                      🟡
                    </div>
                    <div>
                      <div class="font-bold text-sm text-charcoal flex items-center gap-2">
                        <span>Premium +</span>
                        <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-semibold">360 GB</span>
                      </div>
                      <div class="text-[11px] text-muted font-sans-ui">Developer များ၊ သုတေသီများနှင့် Heavy Users များအတွက်</div>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="font-mono font-bold text-base text-charcoal">12,990 <span class="text-xs font-sans">ကျပ်</span></div>
                    <div class="text-[10px] text-muted font-mono">30 Days</div>
                  </div>
                </div>
              </div>
            </div>

            <a href="https://t.me/PassThruAppBot" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 rounded-xl bg-charcoal text-white hover:bg-vermilion transition-all text-xs font-medium flex items-center justify-center space-x-2 shadow-xs">
              <i class="ri-shopping-cart-2-line"></i>
              <span>၁ လ သက်တမ်း Package ဝယ်ယူရန် (@PassThruAppBot)</span>
            </a>
          </div>

          <!-- 3 Months (90 Days) Panel (Long-Term Savings) -->
          <div class="p-6 sm:p-7 rounded-3xl border border-amber-500/40 bg-card shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-gradient-to-l from-amber-500 to-vermilion text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Save More • အထူးသက်သာ ရေရှည်
            </div>
            <div>
              <div class="flex items-center justify-between pb-4 mb-5 border-b border-hairline">
                <div>
                  <span class="text-xs font-mono uppercase text-amber-600 font-bold tracking-wider">LONG TERM VALUE</span>
                  <h4 class="text-xl font-serif-editorial font-bold text-charcoal flex items-center gap-2">
                    <i class="ri-calendar-check-line text-amber-500"></i> ၃ လ (ရက် ၉၀) Packages
                  </h4>
                </div>
                <span class="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold">ရက် ၉၀ သက်တမ်း</span>
              </div>

              <!-- Packages List -->
              <div class="space-y-3.5 mb-6">
                <!-- Standard 300GB -->
                <div class="p-4 rounded-2xl border border-hairline hover:border-blue-500/40 bg-cream/30 dark:bg-stone-900/40 transition-all flex items-center justify-between gap-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      🔵
                    </div>
                    <div>
                      <div class="font-bold text-sm text-charcoal flex items-center gap-2">
                        <span>Standard</span>
                        <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-semibold">300 GB</span>
                      </div>
                      <div class="text-[11px] text-muted font-sans-ui">၃ လတာ အေးဆေး စိတ်ချလက်ချ သုံးစွဲနိုင်မှု</div>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="font-mono font-bold text-base text-charcoal">12,400 <span class="text-xs font-sans">ကျပ်</span></div>
                    <div class="text-[10px] text-muted font-mono">90 Days</div>
                  </div>
                </div>

                <!-- Premium 600GB -->
                <div class="p-4 rounded-2xl border border-hairline hover:border-amber-500/40 bg-cream/30 dark:bg-stone-900/40 transition-all flex items-center justify-between gap-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                      🟡
                    </div>
                    <div>
                      <div class="font-bold text-sm text-charcoal flex items-center gap-2">
                        <span>Premium</span>
                        <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">600 GB</span>
                      </div>
                      <div class="text-[11px] text-muted font-sans-ui">၃ လအတွင်း GB အများအပြား သုံးစွဲသူများအတွက်</div>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="font-mono font-bold text-base text-charcoal">21,400 <span class="text-xs font-sans">ကျပ်</span></div>
                    <div class="text-[10px] text-muted font-mono">90 Days</div>
                  </div>
                </div>

                <!-- Premium+ 1100GB (Mega Value) -->
                <div class="p-4 rounded-2xl border-2 border-vermilion/50 bg-vermilion/5 dark:bg-vermilion/10 transition-all flex items-center justify-between gap-3 relative shadow-2xs">
                  <span class="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-vermilion text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-xs">Mega Value • အထူးတန်</span>
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-vermilion/15 text-vermilion flex items-center justify-center font-bold text-sm shrink-0">
                      🟡
                    </div>
                    <div>
                      <div class="font-bold text-sm text-charcoal flex items-center gap-2">
                        <span>Premium +</span>
                        <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-vermilion/15 text-vermilion font-semibold">1,100 GB</span>
                      </div>
                      <div class="text-[11px] text-muted font-sans-ui">၁ Terabyte ကျော် ပမာဏကြီးမားသော Ultimate Package</div>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="font-mono font-bold text-base text-vermilion">35,900 <span class="text-xs font-sans">ကျပ်</span></div>
                    <div class="text-[10px] text-muted font-mono">90 Days</div>
                  </div>
                </div>
              </div>
            </div>

            <a href="https://t.me/PassThruAppBot" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 rounded-xl bg-vermilion text-white hover:bg-vermilion-hover transition-all text-xs font-medium flex items-center justify-center space-x-2 shadow-xs">
              <i class="ri-shopping-cart-2-line"></i>
              <span>၃ လ သက်တမ်း Package ဝယ်ယူရန် (@PassThruAppBot)</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Part 4: Core Advantages & 10-Country Global Server Mesh -->
      <div class="p-6 sm:p-7 rounded-3xl border border-hairline bg-cream/50 dark:bg-stone-900/40 mb-10 shadow-2xs">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <!-- Feat 1 -->
          <div class="flex items-start space-x-3.5">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center text-lg shrink-0">
              <i class="ri-smartphone-line"></i>
            </div>
            <div>
              <div class="font-bold text-sm text-charcoal mb-0.5" data-mm="Device အကန့်အသတ် (လုံးဝ) မရှိ" data-en="Unlimited Devices Simultaneous">Device အကန့်အသတ် (လုံးဝ) မရှိ</div>
              <p class="text-xs text-muted leading-relaxed font-sans-ui" data-mm="အကောင့်တစ်ခု ဝယ်ယူထားရုံဖြင့် မိမိအသုံးပြုသည့် ဖုန်း၊ ကွန်ပျူတာ၊ တက်ဘလက် စက်ပစ္စည်းအားလုံးတွင် Device ကန့်သတ်ချက် လုံးဝမရှိဘဲ စိတ်ကြိုက် အသုံးပြုနိုင်ပါသည်။" data-en="Connect across all your phones, laptops, and tablets with zero device restrictions on a single subscription.">
                အကောင့်တစ်ခု ဝယ်ယူထားရုံဖြင့် မိမိအသုံးပြုသည့် ဖုန်း၊ ကွန်ပျူတာ၊ တက်ဘလက် စက်ပစ္စည်းအားလုံးတွင် Device ကန့်သတ်ချက် လုံးဝမရှိဘဲ စိတ်ကြိုက် အသုံးပြုနိုင်ပါသည်။
              </p>
            </div>
          </div>

          <!-- Feat 2 -->
          <div class="flex items-start space-x-3.5">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-lg shrink-0">
              <i class="ri-global-line"></i>
            </div>
            <div>
              <div class="font-bold text-sm text-charcoal mb-0.5" data-mm="၁၀ နိုင်ငံ ဆာဗာများ စိတ်ကြိုက်ရွေးချယ်ခွင့်" data-en="10+ Global Server Locations">၁၀ နိုင်ငံ ဆာဗာများ စိတ်ကြိုက်ရွေးချယ်ခွင့်</div>
              <p class="text-xs text-muted leading-relaxed font-sans-ui" data-mm="PassThru VPN တွင် ပါဝင်သော Singapore 🇸🇬, Thailand 🇹🇭, Japan 🇯🇵, US 🇺🇸, UK 🇬🇧, Malaysia 🇲🇾, Indonesia 🇮🇩 အပါအဝင် ၁၀ နိုင်ငံရှိ Server အားလုံးကို မိမိစိတ်ကြိုက် အချိန်မရွေး ကိုယ်တိုင်ရွေးချယ် ပြောင်းလဲအသုံးပြုနိုင်ပါသည်။" data-en="Freely switch across 10 global locations including Singapore, Thailand, Japan, US, UK, Malaysia, and Indonesia.">
                PassThru VPN တွင် ပါဝင်သော Singapore 🇸🇬, Thailand 🇹🇭, Japan 🇯🇵, US 🇺🇸, UK 🇬🇧, Malaysia 🇲🇾, Indonesia 🇮🇩 အပါအဝင် ၁၀ နိုင်ငံရှိ Server အားလုံးကို မိမိစိတ်ကြိုက် အချိန်မရွေး ကိုယ်တိုင်ရွေးချယ် ပြောင်းလဲအသုံးပြုနိုင်ပါသည်။
              </p>
            </div>
          </div>

          <!-- Feat 3 -->
          <div class="flex items-start space-x-3.5">
            <div class="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 flex items-center justify-center text-lg shrink-0">
              <i class="ri-hourglass-2-line"></i>
            </div>
            <div>
              <div class="font-bold text-sm text-charcoal mb-0.5" data-mm="သတ်မှတ်သက်တမ်းအတွင်း စိတ်ကြိုက်သုံးစွဲနိုင်မှု" data-en="Flexible Validity Usage">သတ်မှတ်သက်တမ်းအတွင်း စိတ်ကြိုက်သုံးစွဲနိုင်မှု</div>
              <p class="text-xs text-muted leading-relaxed font-sans-ui" data-mm="ဝယ်ယူထားသော Data (GB) ကို သတ်မှတ်သက်တမ်း (ရက် ၃၀ သို့မဟုတ် ရက် ၉၀) အတွင်း ကုန်သည်အထိ စိတ်ကြိုက် လွတ်လပ်စွာ သုံးစွဲနိုင်ပါသည်။" data-en="Use your full data quota comfortably over the designated 30 or 90 days with transparent usage accounting.">
                ဝယ်ယူထားသော Data (GB) ကို သတ်မှတ်သက်တမ်း (ရက် ၃၀ သို့မဟုတ် ရက် ၉၀) အတွင်း ကုန်သည်အထိ စိတ်ကြိုက် လွတ်လပ်စွာ သုံးစွဲနိုင်ပါသည်။
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Part 5: Official Telegram Ecosystem & Direct Action Links -->
      <div class="p-6 rounded-3xl border border-hairline bg-card shadow-xs">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 pb-4 border-b border-hairline">
          <div>
            <h4 class="font-serif-editorial font-bold text-lg text-charcoal" data-mm="PassThru VPN တရားဝင် ကွန်ရက်များနှင့် ဆက်သွယ်ရန်" data-en="Official Channels &amp; Instant Ordering">
              PassThru VPN တရားဝင် ကွန်ရက်များနှင့် ဆက်သွယ်ရန်
            </h4>
            <p class="text-xs text-muted font-sans-ui">Package များ ဝယ်ယူရန်၊ အကူအညီရယူရန်နှင့် သတင်းအချက်အလက်များ သိရှိရန် အောက်ပါ လင့်ခ်များမှတစ်ဆင့် ဆက်သွယ်နိုင်ပါသည်</p>
          </div>
          <span class="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5 shrink-0">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 24/7 Support Available
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Channel -->
          <a href="https://t.me/PassThruVPN" target="_blank" rel="noopener noreferrer" class="p-4 rounded-2xl border border-hairline hover:border-vermilion bg-cream/20 hover:bg-cream/50 dark:hover:bg-stone-900/50 transition-all flex items-center space-x-3 group shadow-2xs">
            <div class="w-10 h-10 rounded-xl bg-[#2AABEE]/15 text-[#2AABEE] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              <i class="ri-telegram-fill"></i>
            </div>
            <div class="truncate">
              <div class="font-bold text-xs text-charcoal group-hover:text-vermilion transition-colors">Official Channel</div>
              <div class="text-[11px] text-muted font-mono truncate">@PassThruVPN</div>
            </div>
          </a>

          <!-- Bot -->
          <a href="https://t.me/PassThruAppBot" target="_blank" rel="noopener noreferrer" class="p-4 rounded-2xl border border-hairline hover:border-vermilion bg-cream/20 hover:bg-cream/50 dark:hover:bg-stone-900/50 transition-all flex items-center space-x-3 group shadow-2xs">
            <div class="w-10 h-10 rounded-xl bg-vermilion/15 text-vermilion flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              <i class="ri-robot-2-line"></i>
            </div>
            <div class="truncate">
              <div class="font-bold text-xs text-charcoal group-hover:text-vermilion transition-colors">App Store Bot</div>
              <div class="text-[11px] text-muted font-mono truncate">@PassThruAppBot</div>
            </div>
          </a>

          <!-- Support -->
          <a href="https://t.me/PassThruSupport" target="_blank" rel="noopener noreferrer" class="p-4 rounded-2xl border border-hairline hover:border-vermilion bg-cream/20 hover:bg-cream/50 dark:hover:bg-stone-900/50 transition-all flex items-center space-x-3 group shadow-2xs">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              <i class="ri-customer-service-2-line"></i>
            </div>
            <div class="truncate">
              <div class="font-bold text-xs text-charcoal group-hover:text-vermilion transition-colors">24/7 Help Desk</div>
              <div class="text-[11px] text-muted font-mono truncate">@PassThruSupport</div>
            </div>
          </a>

          <!-- Community -->
          <a href="https://t.me/PassThruCommunity" target="_blank" rel="noopener noreferrer" class="p-4 rounded-2xl border border-hairline hover:border-vermilion bg-cream/20 hover:bg-cream/50 dark:hover:bg-stone-900/50 transition-all flex items-center space-x-3 group shadow-2xs">
            <div class="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              <i class="ri-group-line"></i>
            </div>
            <div class="truncate">
              <div class="font-bold text-xs text-charcoal group-hover:text-vermilion transition-colors">User Community</div>
              <div class="text-[11px] text-muted font-mono truncate">@PassThruCommunity</div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- SECTION 09: COMPLETE MASTER INVENTORY TABLE -->
    <section class="mb-14" aria-labelledby="inventory-heading">
      <div class="flex items-center space-x-3 mb-8 pb-3 border-b border-hairline">
        <div class="w-10 h-10 rounded-2xl bg-vermilion/10 text-vermilion flex items-center justify-center font-bold text-lg">09</div>'''

    if sec_target in html:
        html = html.replace(sec_target, sec_replacement, 1)
        print("✓ Section 08 (PassThru VPN) inserted and Section 09 renumbered successfully")
    else:
        print("✗ Section target not found")
        sys.exit(1)

    # 3. Add Row 27 to Master Technical Inventory Table for PassThru VPN
    row_target = '''              <!-- 26. W3C Service Worker -->
              <tr class="hover:bg-cream/30 dark:hover:bg-stone-900/30 transition-colors">
                <td class="py-3 px-4 font-bold text-charcoal">W3C Service Worker &amp; Cache API</td>
                <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px]">Web Standard</span></td>
                <td class="py-3 px-4 text-muted">W3C Web Incubator / Browser Vendors</td>
                <td class="py-3 px-4 font-mono text-[10px]">W3C Software</td>
                <td class="py-3 px-4 font-mono text-vermilion"><a href="https://w3c.github.io/ServiceWorker" target="_blank" rel="noopener noreferrer">w3c.org</a></td>
                <td class="py-3 px-4 font-mono text-[10px] text-muted"><code>sw.js</code> (PWA v7.0 Cache)</td>
              </tr>'''

    row_replacement = '''              <!-- 26. W3C Service Worker -->
              <tr class="hover:bg-cream/30 dark:hover:bg-stone-900/30 transition-colors">
                <td class="py-3 px-4 font-bold text-charcoal">W3C Service Worker &amp; Cache API</td>
                <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px]">Web Standard</span></td>
                <td class="py-3 px-4 text-muted">W3C Web Incubator / Browser Vendors</td>
                <td class="py-3 px-4 font-mono text-[10px]">W3C Software</td>
                <td class="py-3 px-4 font-mono text-vermilion"><a href="https://w3c.github.io/ServiceWorker" target="_blank" rel="noopener noreferrer">w3c.org</a></td>
                <td class="py-3 px-4 font-mono text-[10px] text-muted"><code>sw.js</code> (PWA v7.0 Cache)</td>
              </tr>

              <!-- 27. PassThru VPN -->
              <tr class="hover:bg-amber-500/10 dark:hover:bg-stone-900/40 transition-colors bg-amber-500/5">
                <td class="py-3 px-4 font-bold text-charcoal flex items-center gap-1.5">
                  <i class="ri-shield-keyhole-line text-amber-600"></i> PassThru VPN
                </td>
                <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-semibold">Development Sponsor</span></td>
                <td class="py-3 px-4 text-muted">PassThru Networks</td>
                <td class="py-3 px-4 font-mono text-[10px]">Official Partner</td>
                <td class="py-3 px-4 font-mono text-vermilion"><a href="https://t.me/PassThruVPN" target="_blank" rel="noopener noreferrer">t.me/PassThruVPN</a></td>
                <td class="py-3 px-4 font-mono text-[10px] text-muted"><a href="#passthru-vpn" class="underline text-amber-700 dark:text-amber-300">Section 08 Colophon</a></td>
              </tr>'''

    if row_target in html:
        html = html.replace(row_target, row_replacement, 1)
        print("✓ Row 27 (PassThru VPN) added to Master Inventory Table")
    else:
        print("✗ Row target not found")
        sys.exit(1)

    with open('technology.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("✓ technology.html updated successfully!")

if __name__ == '__main__':
    main()
