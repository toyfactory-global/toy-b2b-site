import urllib.request, urllib.error

urls = [
    'https://www.toyfactoryglobal.com/',
    'https://toyfactoryglobal.com/',
    'https://toyfactoryglobal.com/product/TF216208',
    'https://toyfactoryglobal.com/product/TF216208/',
    'https://toyfactoryglobal.com/blog',
    'https://toyfactoryglobal.com/blog/',
    'https://toyfactoryglobal.com/index.html',
]

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise urllib.error.HTTPError(req.full_url, code, msg, headers, fp)

opener = urllib.request.build_opener(NoRedirect)

for u in urls:
    try:
        r = opener.open(u, timeout=15)
        print(f'{r.status}  {u}')
    except urllib.error.HTTPError as e:
        loc = e.headers.get('Location', '')
        print(f'{e.code}  {u}  ->  {loc}')
    except Exception as e:
        print(f'ERR  {u}  {e}')
