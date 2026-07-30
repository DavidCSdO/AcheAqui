def clean_linkedin_url(url: str) -> str:
    if not url:
        return ""
    if "?" in url:
        url = url.split("?")[0]
    return url.strip()
