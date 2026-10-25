#!/usr/bin/env python3
"""Upload (or delete) the synthetic demo pages used for the knowledge-base screenshots.
Usage: python upload_demo_site.py put|del"""
import os, sys, paramiko, posixpath

ENV = '/home/hermes/.hermes/profiles/donna/secrets/vitrue_sftp.env'
SRC = '/home/hermes/.hermes/profiles/platform/cache/scratch/onb-guide/demo_site'
REMOTE = '/home/vitrue-ai/htdocs/ai.vitrue.co.il/cloudchat-guide/_demo'
assert REMOTE.startswith('/home/vitrue-ai/htdocs/ai.vitrue.co.il/cloudchat-guide/')

env = {}
for line in open(ENV):
    line = line.strip()
    if '=' in line and not line.startswith('#'):
        k, v = line.split('=', 1)
        env[k] = v.strip().strip('"').strip("'")

t = paramiko.Transport((env['SFTP_HOST'], int(env.get('SFTP_PORT') or 22)))
t.connect(username=env['SFTP_USER'], password=env['SFTP_PASS'])
s = paramiko.SFTPClient.from_transport(t)

if sys.argv[1] == 'del':
    for f in s.listdir(REMOTE):
        s.remove(posixpath.join(REMOTE, f))
    s.rmdir(REMOTE)
    print('removed', REMOTE)
else:
    try:
        s.stat(REMOTE)
    except IOError:
        s.mkdir(REMOTE, 0o755)
    for f in sorted(os.listdir(SRC)):
        s.put(os.path.join(SRC, f), posixpath.join(REMOTE, f))
        s.chmod(posixpath.join(REMOTE, f), 0o644)
        print('put', f)
s.close(); t.close()
