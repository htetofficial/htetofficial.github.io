#!/usr/bin/env python3
"""
Htet Official — Cloudflare R2 High-Speed Sync Engine
Syncs publications, downloads, research bundles, and static assets to Cloudflare R2 (S3-compatible).
Zero Egress Bandwidth Fees worldwide via Cloudflare CDN.
"""

import os
import sys
import hmac
import hashlib
import datetime
import urllib.request
import urllib.error
import mimetypes
from concurrent.futures import ThreadPoolExecutor, as_completed

ACCOUNT_ID = os.environ.get("CF_ACCOUNT_ID", "dfc590ed7e28d2c0923ed2f1b31432e0")
ACCESS_KEY = os.environ.get("CF_R2_ACCESS_KEY", "1a254d08c7cac365b857ebb371a5f4dc")
SECRET_KEY = os.environ.get("CF_R2_SECRET_KEY", "8ee1ac659da6d874d3954ce78221be866a08cfa9b3972bf2865dbf73db9980d3")
BUCKET_NAME = os.environ.get("CF_R2_BUCKET", "htetofficial-cdn")
ENDPOINT = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"
HOST = f"{ACCOUNT_ID}.r2.cloudflarestorage.com"
REGION = "auto"
SERVICE = "s3"

def sign(key, msg):
    return hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()

def get_signature_key(key, date_stamp, region_name, service_name):
    k_date = sign(('AWS4' + key).encode('utf-8'), date_stamp)
    k_region = sign(k_date, region_name)
    k_service = sign(k_region, service_name)
    return sign(k_service, 'aws4_request')

def upload_file(rel_path, local_path):
    try:
        with open(local_path, 'rb') as f:
            data = f.read()

        size_kb = len(data) / 1024
        content_type, _ = mimetypes.guess_type(local_path)
        if not content_type:
            if local_path.endswith('.md'):
                content_type = 'text/markdown; charset=utf-8'
            elif local_path.endswith('.json'):
                content_type = 'application/json; charset=utf-8'
            else:
                content_type = 'application/octet-stream'

        cache_control = "public, max-age=31536000, immutable"
        key = rel_path.replace('\\', '/')

        now = datetime.datetime.now(datetime.timezone.utc)
        amzdate = now.strftime('%Y%m%dT%H%M%SZ')
        datestamp = now.strftime('%Y%m%d')

        payload_hash = hashlib.sha256(data).hexdigest()
        canonical_uri = f'/{BUCKET_NAME}/{urllib.parse.quote(key, safe="/-_.~")}'
        canonical_querystring = ''
        canonical_headers = (
            f'cache-control:{cache_control}\n'
            f'content-type:{content_type}\n'
            f'host:{HOST}\n'
            f'x-amz-content-sha256:{payload_hash}\n'
            f'x-amz-date:{amzdate}\n'
        )
        signed_headers = 'cache-control;content-type;host;x-amz-content-sha256;x-amz-date'
        canonical_request = f'PUT\n{canonical_uri}\n{canonical_querystring}\n{canonical_headers}\n{signed_headers}\n{payload_hash}'

        algorithm = 'AWS4-HMAC-SHA256'
        credential_scope = f'{datestamp}/{REGION}/{SERVICE}/aws4_request'
        string_to_sign = f'{algorithm}\n{amzdate}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode("utf-8")).hexdigest()}'

        signing_key = get_signature_key(SECRET_KEY, datestamp, REGION, SERVICE)
        signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
        auth_hdr = f'{algorithm} Credential={ACCESS_KEY}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}'

        url = f'{ENDPOINT}/{BUCKET_NAME}/{urllib.parse.quote(key, safe="/-_.~")}'
        req = urllib.request.Request(url, data=data, method='PUT')
        req.add_header('cache-control', cache_control)
        req.add_header('content-type', content_type)
        req.add_header('x-amz-date', amzdate)
        req.add_header('x-amz-content-sha256', payload_hash)
        req.add_header('Authorization', auth_hdr)

        timeout_val = 600 if len(data) > 5 * 1024 * 1024 else 120
        with urllib.request.urlopen(req, timeout=timeout_val) as resp:
            if resp.status in (200, 204):
                return True, f"✓ {key} ({size_kb:.1f} KB)"
            return False, f"HTTP {resp.status} for {key}"
    except Exception as e:
        return False, f"✗ {rel_path}: {e}"

def main():
    print("=" * 60)
    print("⚡ Htet Official Cloudflare R2 Sync Engine")
    print(f"• Target Bucket: {BUCKET_NAME}")
    print(f"• Endpoint: {ENDPOINT}")
    print("=" * 60)

    files_to_upload = []

    # 1. downloads directory (PDFs & Monographs)
    if os.path.exists('downloads'):
        for root, _, files in os.walk('downloads'):
            for f in files:
                if f.startswith('.'): continue
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, '.')
                files_to_upload.append((rel_path, full_path))

    # 2. Large bundles
    if os.path.exists('Htet_Official_Research_Bundle.zip'):
        files_to_upload.append(('Htet_Official_Research_Bundle.zip', 'Htet_Official_Research_Bundle.zip'))

    # 3. Assets directory (images)
    if os.path.exists('assets/images'):
        for root, _, files in os.walk('assets/images'):
            for f in files:
                if f.startswith('.'): continue
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, '.')
                files_to_upload.append((rel_path, full_path))

    # 4. Data files
    if os.path.exists('data/articles.json'):
        files_to_upload.append(('data/articles.json', 'data/articles.json'))

    print(f"Total files identified for sync: {len(files_to_upload)}")
    uploaded = 0
    failed = 0

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(upload_file, rel, full): rel for rel, full in files_to_upload}
        for future in as_completed(futures):
            ok, msg = future.result()
            if ok:
                uploaded += 1
                print(msg)
            else:
                failed += 1
                print(msg, file=sys.stderr)

    print("=" * 60)
    print(f"Sync Finished! Uploaded: {uploaded}, Failed: {failed}")
    print("=" * 60)

if __name__ == '__main__':
    main()
