import os
import markdown

with open('template.html') as t:
    TEMPLATE = t.read()

with os.scandir('text') as it:
    for entry in it:
        if not entry.name.startswith('.') and entry.is_file():
            with open(entry.path) as f:
                data = f.readlines()
                title = data[0]
                content = markdown.markdown('\n'.join(data[1:]))
                with open('chapters/'+'.'.join(entry.name.split('.')[:-1])+'.html', 'w') as g:
                    g.write(TEMPLATE.replace('%TITLE%', title).replace('%CONTENT%', content))
