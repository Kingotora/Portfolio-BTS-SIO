import os
import re

files = [f for f in os.listdir('.') if f.endswith('.html')]

script_regex = re.compile(r'<script\s+src="[^"]+"></script>\s*', re.IGNORECASE)
footer_regex = re.compile(r'© 202.\s+Brieuc Métairie', re.IGNORECASE)

standard_scripts_base = [
    '<script src="js/lang.js?v=3"></script>',
    '<script src="script.js?v=3" defer></script>',
    '<script src="js/console.js?v=3" defer></script>'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine scripts for this file
    scripts = standard_scripts_base.copy()
    
    # Add projects.js for index and activites, and project pages?
    # Project pages seem to not strictly need it unless they utilize shared logic.
    # But let's check if the file had it.
    has_projects = 'projects.js' in content
    has_rss = 'rss_manager.js' in content

    # Rebuild script list based on what was there or needed
    # Better: just enforce the standard set + specifics
    
    current_scripts = []
    if file in ['index.html', 'activites.html']:
        current_scripts.append('<script src="js/lang.js?v=3"></script>')
        current_scripts.append('<script src="js/projects.js?v=3" defer></script>')
        current_scripts.append('<script src="script.js?v=3" defer></script>')
        current_scripts.append('<script src="js/console.js?v=3" defer></script>')
    elif file == 'veille.html':
        current_scripts.append('<script src="rss_manager.js?v=3" defer></script>')
        current_scripts.append('<script src="js/lang.js?v=3"></script>')
        current_scripts.append('<script src="script.js?v=3" defer></script>')
        current_scripts.append('<script src="js/console.js?v=3" defer></script>')
    else:
        # Default set
        current_scripts.append('<script src="js/lang.js?v=3"></script>')
        # projects.js is lightweight, maybe include it everywhere for simplicity/caching?
        # But let's stick to base for now.
        current_scripts.append('<script src="script.js?v=3" defer></script>')
        current_scripts.append('<script src="js/console.js?v=3" defer></script>')

    # Remove existing script tags that match our known scripts
    # This is a bit aggressive, better to remove all known script tags and append new block
    
    known_scripts = ['js/lang.js', 'js/projects.js', 'script.js', 'js/console.js', 'rss_manager.js']
    
    # Remove lines containing these scripts
    lines = content.split('\n')
    new_lines = []
    script_block_inserted = False
    
    # Find position of </body>
    body_end_index = -1
    for i, line in enumerate(lines):
        if '</body>' in line:
            body_end_index = i
            break
            
    if body_end_index == -1:
        print(f"Skipping {file}: No </body> tag")
        continue

    # Filter out old scripts
    cleaned_lines = []
    for line in lines:
        is_known = False
        for s in known_scripts:
            if s in line and '<script' in line:
                is_known = True
                break
        if not is_known:
            cleaned_lines.append(line)
        else:
            # Check if it's inside the body (we want to remove it to re-insert at bottom)
            # Actually, removing anywhere is fine as we insert at bottom.
            pass

    # Now verify where to insert. We removed them, so content might be cleaner.
    # We re-find body tag index in cleaned content
    
    final_lines = []
    inserted = False
    for line in cleaned_lines:
        if '</body>' in line and not inserted:
            # Insert scripts before body end
            for s in current_scripts:
                final_lines.append('    ' + s)
            final_lines.append(line)
            inserted = True
        else:
            final_lines.append(line)
            
    new_content = '\n'.join(final_lines)
    
    # Fix copyright
    new_content = footer_regex.sub('© 2026 Brieuc Métairie', new_content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {file}")
