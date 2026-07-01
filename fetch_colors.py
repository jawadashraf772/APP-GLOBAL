import urllib.request
import re

req = urllib.request.Request('https://appsglobal.co/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        css_links = re.findall(r'<link[^>]*href=[\'\"]([^\'\"]+\.css)[^\'\"]*[\'\"]', html)
        for css in css_links:
            url = css if css.startswith('http') else 'https://appsglobal.co' + (css if css.startswith('/') else '/' + css)
            css_req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(css_req) as css_res:
                css_content = css_res.read().decode('utf-8')
                
                # Search for :root { ... } and capture variables
                root_blocks = re.findall(r':root\s*\{([^}]+)\}', css_content)
                for root in root_blocks:
                    primary_vars = re.findall(r'--color-primary-[0-9]+:\s*([^;]+);', root)
                    if primary_vars:
                        print('Primary vars in :root:', primary_vars)
                        
                # Alternative: just grab all #hex colors in the CSS and count
                all_hex = re.findall(r'#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b', css_content)
                from collections import Counter
                print('Top 20 hex in', url, Counter(['#' + c.lower() for c in all_hex]).most_common(20))
except Exception as e:
    print('Error:', e)
