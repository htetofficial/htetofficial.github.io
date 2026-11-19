#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Htet Official — Telegram Bot Webhook Manager
Easily set, check, or delete Telegram Webhook
"""

import sys
import os
import json
import urllib.request
import urllib.parse

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 set_webhook.py get <BOT_TOKEN>")
        print("  python3 set_webhook.py set <BOT_TOKEN> <WEBHOOK_URL>")
        print("  python3 set_webhook.py delete <BOT_TOKEN>")
        sys.exit(1)

    action = sys.argv[1].lower()
    token = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("TELEGRAM_BOT_TOKEN")

    if not token:
        print("❌ Error: BOT_TOKEN is required.")
        sys.exit(1)

    api_base = f"https://api.telegram.org/bot{token}/"

    if action == 'get':
        url = api_base + "getWebhookInfo"
        with urllib.request.urlopen(url) as r:
            print(json.dumps(json.loads(r.read().decode('utf-8')), indent=2, ensure_ascii=False))

    elif action == 'set':
        if len(sys.argv) < 4:
            print("❌ Error: WEBHOOK_URL is required for 'set'.")
            sys.exit(1)
        webhook_url = sys.argv[3]
        url = api_base + f"setWebhook?url={urllib.parse.quote(webhook_url)}"
        with urllib.request.urlopen(url) as r:
            print(json.dumps(json.loads(r.read().decode('utf-8')), indent=2, ensure_ascii=False))

    elif action == 'delete':
        url = api_base + "deleteWebhook"
        with urllib.request.urlopen(url) as r:
            print(json.dumps(json.loads(r.read().decode('utf-8')), indent=2, ensure_ascii=False))

    else:
        print(f"Unknown action: {action}")

if __name__ == '__main__':
    main()
