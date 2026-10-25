#!/usr/bin/env python3
"""Upload the guide to ai.vitrue.co.il/cloudchat-guide/ over SFTP. Reads credentials from Donna's env file, never prints them.
Only writes inside htdocs/ai.vitrue.co.il/cloudchat-guide/. Refuses to overwrite an existing file (Cloudflare pins old bytes)
unless it is index.html."""
import os, sys, paramiko, posixpath

ENV = '/home/hermes/.hermes/profiles/donna/secrets/vitrue_sftp.env'
SRC = '/home/hermes/.hermes/profiles/platform/cache/scratch/onb-guide/guide'
REMOTE = '/home/vitrue-ai/htdocs/ai.vitrue.co.il/cloudchat-guide'
SKIP = {'.git', '_src'}

env = {}
for line in open(ENV):
    line = line.strip()
    if '=' in line and not line.startswith('#'):
        k, v = line.split('=', 1)
        env[k] = v.strip().strip('"').strip("'")

t = paramiko.Transport((env['SFTP_HOST'], int(env.get('SFTP_PORT') or 22)))
t.connect(username=env['SFTP_USER'], password=env['SFTP_PASS'])
s = paramiko.SFTPClient.from_transport(t)
assert REMOTE.startswith('/home/vitrue-ai/htdocs/ai.vitrue.co.il/') and '..' not in REMOTE


def exists(p):
    try:
        s.stat(p); return True
    except IOError:
        return False


def mkdir(p):
    if not exists(p):
        s.mkdir(p, 0o755)


mkdir(REMOTE)
n = 0
for root, dirs, files in os.walk(SRC):
    dirs[:] = [d for d in dirs if d not in SKIP]
    rel = os.path.relpath(root, SRC)
    rdir = REMOTE if rel == '.' else posixpath.join(REMOTE, rel)
    mkdir(rdir)
    for f in files:
        rp = posixpath.join(rdir, f)
        if exists(rp) and f != 'index.html' and '--force' not in sys.argv:
            print('SKIP existing', posixpath.relpath(rp, REMOTE)); continue
        s.put(os.path.join(root, f), rp)
        s.chmod(rp, 0o644)
        n += 1
print('uploaded', n)
print('remote listing:', sorted(s.listdir(REMOTE)))
s.close(); t.close()
