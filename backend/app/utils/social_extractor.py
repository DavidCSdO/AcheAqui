import re
from typing import Dict, Optional


def extract_social_links(text: str) -> Dict[str, Optional[str]]:
    """Extract Instagram, Facebook, LinkedIn, TikTok, YouTube, X (Twitter), Pinterest links."""
    socials: Dict[str, Optional[str]] = {
        "instagram": None,
        "facebook": None,
        "linkedin": None,
        "youtube": None,
        "tiktok": None,
        "x": None,
        "pinterest": None,
    }
    if not text:
        return socials
        
    # Instagram
    insta_match = re.search(r'https?://(?:www\.)?instagram\.com/[a-zA-Z0-9_.]+', text)
    if insta_match:
        url = insta_match.group(0).rstrip('.')
        if not any(x in url.lower() for x in ['/p/', '/reel/', '/stories/', '/explore/', '/developer/']):
            socials["instagram"] = url
            
    # Facebook
    fb_match = re.search(r'https?://(?:www\.)?facebook\.com/[a-zA-Z0-9_.]+', text)
    if fb_match:
        url = fb_match.group(0).rstrip('.')
        if not any(x in url.lower() for x in ['/sharer', '/share', '/dialog', '/policies']):
            socials["facebook"] = url
            
    # LinkedIn
    li_match = re.search(r'https?://(?:www\.)?linkedin\.com/(?:company|in)/[a-zA-Z0-9_-]+', text)
    if li_match:
        socials["linkedin"] = li_match.group(0).rstrip('.')
        
    # YouTube
    yt_match = re.search(r'https?://(?:www\.)?youtube\.com/(?:c/|channel/|user/|@)?[a-zA-Z0-9_-]+', text)
    if yt_match:
        socials["youtube"] = yt_match.group(0).rstrip('.')
        
    # TikTok
    tt_match = re.search(r'https?://(?:www\.)?tiktok\.com/@[a-zA-Z0-9_.]+', text)
    if tt_match:
        socials["tiktok"] = tt_match.group(0).rstrip('.')
        
    # X / Twitter
    x_match = re.search(r'https?://(?:www\.)?(?:twitter\.com|x\.com)/[a-zA-Z0-9_]+', text)
    if x_match:
        socials["x"] = x_match.group(0).rstrip('.')
        
    return socials
