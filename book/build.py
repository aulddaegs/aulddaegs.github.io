import os
import markdown
import hashlib

with open('template.html') as t:
    TEMPLATE = t.read()

with os.scandir('text') as it:
    for entry in it:
        if not entry.name.startswith('.') and entry.is_file():
            ename = '.'.join(entry.name.split('.')[:-1])
            with open(entry.path) as f:
                data = f.readlines()
                if not data:
                     print(f'Skipping empty file {ename}.')
                     continue
                checksum = hashlib.md5('\n'.join(data).encode('utf-8')).hexdigest()
                if os.path.isfile('lock/'+ename+'.md5checksum'):
                    with open('lock/'+ename+'.md5checksum') as c:
                        if not c.read() == checksum:
                            print('Contents of chapter '+ename+' are being refreshed.')
                            with open('chapters/'+ename+'.html', 'w') as g:
                                title = data[0]
                                content = markdown.markdown('\n'.join(data[1:]))
                                g.write(TEMPLATE.replace('%TITLE%', title).replace('%CONTENT%', content))
                else:
                    print('No checksum exists for chapter '+ename)
                    with open('chapters/'+ename+'.html', 'w') as g:
                                title = data[0]
                                content = markdown.markdown('\n'.join(data[1:]))
                                g.write(TEMPLATE.replace('%TITLE%', title).replace('%CONTENT%', content))
                with open('lock/'+ename+'.md5checksum', 'w') as c:
                    c.write(checksum)
