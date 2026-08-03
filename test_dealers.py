import urllib.request, json
url_public = 'https://supabase.alpine-korea.co.kr/rest/v1/dealers?select=*'
url_alpine = 'https://supabase.alpine-korea.co.kr/rest/v1/dealers?select=*'
headers_public = { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us' }
headers_alpine = headers_public.copy()
headers_alpine['Accept-Profile'] = 'alpine-home'

try:
    req_pub = urllib.request.Request(url_public, headers=headers_public)
    pub_data = json.loads(urllib.request.urlopen(req_pub).read())
    print('Public dealers count:', len(pub_data))
    print('Public dealers snippet:', pub_data[:2])
except Exception as e: print('Public Error:', e)

try:
    req_alp = urllib.request.Request(url_alpine, headers=headers_alpine)
    alp_data = json.loads(urllib.request.urlopen(req_alp).read())
    print('Alpine dealers count:', len(alp_data))
    print('Alpine dealers snippet:', alp_data[:2])
except Exception as e: print('Alpine Error:', e)
