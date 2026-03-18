import re
import traceback

try:
    with open(r'c:\Users\Admin\OneDrive\Desktop\As-Dance\landing.html', 'r', encoding='utf-8') as f:
        html = f.read()

    style_start = html.find('<style>')
    style_end = html.find('</style>')
    
    if style_start != -1 and style_end != -1:
        css = html[style_start+7:style_end]
        
        css = css.replace('body {', '.landing-promo-wrapper {')
        css = css.replace('html {', '.landing-promo-wrapper {')
        css = css.replace('h1,\n    h2,\n    h3,\n    h4 {', '.landing-promo-wrapper h1, .landing-promo-wrapper h2, .landing-promo-wrapper h3, .landing-promo-wrapper h4 {')
        css = css.replace('a {', '.landing-promo-wrapper a {')
        css = css.replace('ul {', '.landing-promo-wrapper ul {')
        css = css.replace('button {', '.landing-promo-wrapper button {')
        css = css.replace('section {', '.landing-promo-wrapper section {')

        with open(r'c:\Users\Admin\OneDrive\Desktop\As-Dance\frontend\src\ui\landing-promo.css', 'w', encoding='utf-8') as f:
            f.write("/* UPDATED CSS FROM HTML */\n" + css)
        print("CSS WRITTEN: ", len(css))
    else:
        print("NO STYLE TAG")
except Exception as e:
    print("ERROR:")
    traceback.print_exc()
