import re
import os

html_path = r'c:\Users\Admin\OneDrive\Desktop\As-Dance\landing.html'
css_dest = r'c:\Users\Admin\OneDrive\Desktop\As-Dance\frontend\src\ui\landing-promo.css'
jsx_dest = r'c:\Users\Admin\OneDrive\Desktop\As-Dance\.tmp\landing_page_jsx.txt'

if not os.path.exists(os.path.dirname(jsx_dest)):
    os.makedirs(os.path.dirname(jsx_dest))

with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# 1. Extract and update CSS
css_match = re.search(r'<style>(.*?)</style>', html_content, re.DOTALL)
if css_match:
    css = css_match.group(1)
    
    # Prefix some global tags
    css = re.sub(r'(?<![-_\w])body\s*\{', '.landing-promo-wrapper {', css)
    css = re.sub(r'(?<![-_\w])html\s*\{', '.landing-promo-wrapper {', css)
    # Prefix global headers
    css = re.sub(r'(?<![-_\w])h1,\s*h2,\s*h3,\s*h4\s*\{', 
                 '.landing-promo-wrapper h1, .landing-promo-wrapper h2, .landing-promo-wrapper h3, .landing-promo-wrapper h4 {', css)
    css = re.sub(r'(?<![-_\w])a\s*\{', '.landing-promo-wrapper a {', css)
    css = re.sub(r'(?<![-_\w])ul\s*\{', '.landing-promo-wrapper ul {', css)
    css = re.sub(r'(?<![-_\w])button\s*\{', '.landing-promo-wrapper button {', css)
    css = re.sub(r'(?<![-_\w])section\s*\{', '.landing-promo-wrapper section {', css)

    with open(css_dest, 'w', encoding='utf-8') as f:
        f.write("/* Migrated from landing.html */\n" + css)

# 2. Extract and format HTML to JSX
body_match = re.search(r'<body>(.*?)</body>', html_content, re.DOTALL)
if body_match:
    body_html = body_match.group(1)
    
    # Remove script tags and comments
    body_html = re.sub(r'<script.*?>.*?</script>', '', body_html, flags=re.DOTALL)
    body_html = re.sub(r'<!--.*?-->', '', body_html, flags=re.DOTALL)
    
    # Convert 'class="' to 'className="'
    body_html = body_html.replace('class="', 'className="')
    # Convert 'for="' to 'htmlFor="'
    body_html = body_html.replace('for="', 'htmlFor="')
    # Convert 'onclick="' to '' (we will handle onClick in React)
    body_html = re.sub(r'onclick="[^"]*"', '', body_html)
    
    # Handle self closing tags
    body_html = re.sub(r'<(img|input|br|hr|source)([^>]*)(?<!/)>', r'<\1\2 />', body_html)
    
    # Handle style attribute strings string -> object
    def style_to_obj(match):
        style_string = match.group(1)
        declarations = [d.strip() for d in style_string.split(';') if d.strip()]
        react_style = []
        for d in declarations:
            if ':' not in d: continue
            k, v = d.split(':', 1)
            k, v = k.strip(), v.strip()
            # camelCase conversion
            parts = k.split('-')
            cc_k = parts[0] + ''.join(p.capitalize() for p in parts[1:])
            # Value escaping (might contain quotes, so wrap gently)
            v = v.replace('"', "'")
            react_style.append(f'{cc_k}: "{v}"')
        return 'style={{ ' + ', '.join(react_style) + ' }}'
        
    body_html = re.sub(r'style="([^"]*)"', style_to_obj, body_html)
    
    with open(jsx_dest, 'w', encoding='utf-8') as f:
        f.write(body_html)
