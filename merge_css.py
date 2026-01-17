
import os

def merge_css():
    base_dir = r"c:\Users\riote\Downloads\as_dance_full_project\frontend\src\ui"
    styles_path = os.path.join(base_dir, "styles.css")
    header_path = os.path.join(base_dir, "header_new.css")
    
    print(f"Reading {styles_path}...")
    with open(styles_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    # Skip first 1600 lines (Old Header + Hero + Navbar)
    # Line 1600 in the original file was empty, 1599 was }
    # So we want to keep line 1601 onwards.
    # index 1600 is the 1601st line.
    legacy_lines = lines[1600:]
    
    print(f"Reading {header_path}...")
    with open(header_path, "r", encoding="utf-8") as f:
        header_lines = f.readlines()
        
    new_content = header_lines + legacy_lines
    
    print(f"Writing {len(new_content)} lines to {styles_path}...")
    with open(styles_path, "w", encoding="utf-8") as f:
        f.writelines(new_content)
        
    print("Merge complete.")

if __name__ == "__main__":
    merge_css()
