import requests
from bs4 import BeautifulSoup
import json
import logging
from urllib.parse import urlparse, urlunparse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HEADERS = {"User-Agent": "Mozilla/5.0"}

# Function to clean the image URL by removing the unnecessary query parameters
def clean_image_url(url):
    """Removes scaling parameters from image URLs to ensure accessibility."""
    if url:
        return url.split('/revision/')[0]  # Keeps only the base URL
    return None

def scrape_jokers():
    url = "https://balatrogame.fandom.com/wiki/Jokers"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        logger.error(f"Failed to fetch Jokers page: {response.status_code}")
        return []
    soup = BeautifulSoup(response.text, "html.parser")
    table = soup.find("table", class_="fandom-table sortable")
    if not table:
        logger.error("Could not find the Joker table on the page.")
        return []
    
    data = []
    rows = table.find_all("tr")[1:]
    for row in rows:
        cells = row.find_all("td")
        if len(cells) < 8:
            continue
        a_tags = cells[1].find_all("a")
        joker_name = a_tags[-1].get_text(strip=True) if a_tags else "Unknown"
        effect = cells[2].get_text(" ", strip=True)  # Preserves spaces between elements # Ikke fjern det din mongo
        cost = cells[3].get_text(strip=True)
        rarity_span = cells[4].find("span", class_="wds-button")
        rarity = rarity_span.get_text(strip=True) if rarity_span else ""
        unlock = cells[5].get_text(strip=True)
        joker_type = cells[6].get_text(strip=True)
        activation = cells[7].get_text(strip=True)
        img_tag = cells[1].find("img")
        image_url = img_tag["data-src"] if img_tag and "data-src" in img_tag.attrs else (img_tag["src"] if img_tag else None)

        if image_url:
            image_url = clean_image_url(image_url)  # Clean the URL to remove the unnecessary query parameters

        data.append({
            "joker": joker_name,
            "effect": effect,
            "cost": cost,
            "rarity": rarity,
#            "unlock_requirement": unlock,
            "type": joker_type,
            "activation": activation,
            "image_url": image_url
        })
    return data

# The same change should be applied to the other scraping functions
def scrape_tarot_cards():
    url = "https://balatrogame.fandom.com/wiki/Tarot_Cards"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        logger.error(f"Failed to fetch Tarot Cards page: {response.status_code}")
        return []
    soup = BeautifulSoup(response.text, "html.parser")
    
    target_table = None
    for table in soup.find_all("table"):
        headers = [th.get_text(strip=True) for th in table.find_all("th")]
        if "Tarot Card" in headers:
            target_table = table
            break

    if not target_table:
        logger.warning("No Tarot Cards table found.")
        return []

    data = []
    for row in target_table.find_all("tr")[1:]:
        cells = row.find_all("td")
        if len(cells) < 3:
            continue
        tarot_card = cells[0].get_text("\n", strip=True)
        if not tarot_card:
            tarot_card = cells[1].get_text("\n", strip=True)
        img_tag = cells[0].find("img")
        image_url = img_tag["data-src"] if img_tag and "data-src" in img_tag.attrs else (img_tag["src"] if img_tag else None)

        if image_url:
            image_url = clean_image_url(image_url)  # Clean the URL to remove the unnecessary query parameters

        description = cells[2].get_text("\n", strip=True)
        data.append({
            "tarot_card": tarot_card,
            "description": description,
            "image_url": image_url
        })
    return data

def scrape_planet_cards():
    url = "https://balatrogame.fandom.com/wiki/Planet_Cards"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        logger.error(f"Failed to fetch Planet Cards page: {response.status_code}")
        return []
    soup = BeautifulSoup(response.text, "html.parser")
    
    target_table = None
    for table in soup.find_all("table", class_="sortable"):
        header_cells = table.find_all("th")
        if not header_cells:
            continue
        headers = [th.get_text(strip=True) for th in header_cells]
        if "Planet Card" in headers and "Name" in headers:
            target_table = table
            break
    if not target_table:
        logger.warning("No Planet Cards table found.")
        return []
    
    data = []
    for row in target_table.find_all("tr")[1:]:
        cells = row.find_all("td")
        if len(cells) < 5:
            continue

        img_tag = cells[0].find("img")
        image_url = (img_tag["data-src"] if img_tag and "data-src" in img_tag.attrs 
                     else (img_tag["src"] if img_tag else None))

        if image_url:
            image_url = clean_image_url(image_url)  # Clean the URL to remove the unnecessary query parameters

        planet_name = cells[1].get_text("\n", strip=True)
        addition = cells[2].get_text("\n", strip=True)
        poker_hand = cells[3].get_text("\n", strip=True)
        hand_base_score = cells[4].get_text("\n", strip=True)
        
        data.append({
            "planet_card": planet_name,
            "addition": addition,
            "poker_hand": poker_hand,
            "hand_base_score": hand_base_score,
            "image_url": image_url
        })
    return data

def scrape_vouchers():
    url = "https://balatrogame.fandom.com/wiki/Vouchers"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        logger.error(f"Failed to fetch Vouchers page: {response.status_code}")
        return []
    soup = BeautifulSoup(response.text, "html.parser")

    target_table = None
    for table in soup.find_all("table"):
        headers = [th.get_text(strip=True) for th in table.find_all("th")]
        if "Base Voucher" in headers:
            target_table = table
            break

    if not target_table:
        logger.warning("No Vouchers table found.")
        return []

    data = []
    for row in target_table.find_all("tr")[2:]:
        cells = row.find_all("td")
        if len(cells) < 6:
            continue

        base_name = cells[0].get_text(strip=True)
        base_effect = cells[1].get_text(" ", strip=True)
        base_img_tag = cells[0].find("img")
        base_image_url = base_img_tag["data-src"] if base_img_tag and "data-src" in base_img_tag.attrs else (base_img_tag["src"] if base_img_tag else None)

        if base_image_url:
            base_image_url = clean_image_url(base_image_url)  # Clean the URL to remove the unnecessary query parameters

        upgraded_name = cells[2].get_text(strip=True)
        upgraded_effect = cells[3].get_text(" ", strip=True)
        upgraded_img_tag = cells[2].find("img")
        upgraded_image_url = upgraded_img_tag["data-src"] if upgraded_img_tag and "data-src" in upgraded_img_tag.attrs else (upgraded_img_tag["src"] if upgraded_img_tag else None)

        if upgraded_image_url:
            upgraded_image_url = clean_image_url(upgraded_image_url)  # Clean the URL to remove the unnecessary query parameters

        note = cells[5].get_text(" ", strip=True)

        voucher_base = {
            "voucher_type": "Base Voucher",
            "name": base_name,
            "effect": base_effect,
            "note": note,
            "image_url": base_image_url
        }
        voucher_upgraded = {
            "voucher_type": "Upgraded Voucher",
            "name": upgraded_name,
            "effect": upgraded_effect,
            "note": note,
            "image_url": upgraded_image_url
        }
        data.append(voucher_base)
        data.append(voucher_upgraded)

    return data

def scrape_spectral_cards():
    url = "https://balatrogame.fandom.com/wiki/Spectral_Cards"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        logger.error(f"Failed to fetch Spectral Cards page: {response.status_code}")
        return []
    soup = BeautifulSoup(response.text, "html.parser")
    
    target_table = None
    for table in soup.find_all("table"):
        headers = [th.get_text(strip=True) for th in table.find_all("th")]
        if "Spectral Card" in headers:
            target_table = table
            break

    if not target_table:
        logger.warning("No Spectral Cards table found.")
        return []

    data = []
    for row in target_table.find_all("tr")[1:]:
        cells = row.find_all("td")
        if len(cells) < 3:
            continue
        spectral_card = cells[0].get_text("\n", strip=True)
        if not spectral_card:
            spectral_card = cells[1].get_text("\n", strip=True)
        img_tag = cells[0].find("img")
        image_url = img_tag["data-src"] if img_tag and "data-src" in img_tag.attrs else (img_tag["src"] if img_tag else None)

        if image_url:
            image_url = clean_image_url(image_url)  # Clean the URL to remove the unnecessary query parameters

        description = cells[2].get_text("\n", strip=True)
        data.append({
            "spectral_card": spectral_card,
            "description": description,
            "image_url": image_url
        })
    return data


def scrape_blinds():
    url = "https://balatrogame.fandom.com/wiki/Blinds_and_Antes"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        logging.error(f"Failed to fetch Blinds and Antes page: {response.status_code}")
        return []
    
    soup = BeautifulSoup(response.text, "html.parser")
    tables = soup.find_all("table")
    data = []
    
    for table in tables:
        headers = [th.get_text(strip=True) for th in table.find_all("th")]
        if "Blind" in headers and "Name" in headers:
            for row in table.find_all("tr")[1:]:
                cells = row.find_all("td")
                if len(cells) < 5:
                    continue

                img_tag = cells[0].find("img")
                image_url = (img_tag["data-src"] if img_tag and "data-src" in img_tag.attrs 
                            else (img_tag["src"] if img_tag else None))

                if image_url:
                    image_url = clean_image_url(image_url)  # Clean the URL to remove the unnecessary query parameters
                
                blind_name = cells[1].get_text(strip=True)
                description = cells[2].get_text(strip=True)
                min_ante = cells[3].get_text(strip=True)
                score_requirement = cells[4].get_text(strip=True)
                earnings = cells[5].get_text(strip=True)
                
                data.append({
                    "image_url": image_url,
                    "name": blind_name,
                    "description": description,
                    "minimum_ante": min_ante,
                    "score_requirement": score_requirement,
                    "earnings": earnings
                })
    
    return data


def main():
    jokers = scrape_jokers()
    with open("balatro_jokers.json", "w", encoding="utf-8") as f:
        json.dump(jokers, f, ensure_ascii=False, indent=2)
    logger.info(f"Scraped {len(jokers)} Jokers.")

    tarots = scrape_tarot_cards()
    with open("tarot_cards.json", "w", encoding="utf-8") as f:
        json.dump(tarots, f, ensure_ascii=False, indent=2)
    logger.info(f"Scraped {len(tarots)} Tarot Cards.")
    
    planets = scrape_planet_cards()
    with open("planet_cards.json", "w", encoding="utf-8") as f:
        json.dump(planets, f, ensure_ascii=False, indent=2)
    logger.info(f"Scraped {len(planets)} Planet Cards.")
    
    vouchers = scrape_vouchers()
    with open("vouchers.json", "w", encoding="utf-8") as f:
        json.dump(vouchers, f, ensure_ascii=False, indent=2)
    logger.info(f"Scraped {len(vouchers)} Vouchers.")

    spectral = scrape_spectral_cards()
    with open("spectral.json", "w", encoding="utf-8") as f:
        json.dump(spectral, f, ensure_ascii=False, indent=2)
    logger.info(f"Scraped {len(spectral)} Spectrals.")



    blind = scrape_blinds()
    with open("blind.json", "w", encoding="utf-8") as f:
        json.dump(blind, f, ensure_ascii=False, indent=2)
    logger.info(f"Scraped {len(blind)} Blinds.")    


if __name__ == "__main__":
    main()
