import json
import random

data = json.load(open('../res/property-info.json'))
newData = list()

seen = set()

for listing in data:
    if not listing['marketing_description']:
        continue
    if not listing['market_rent']:
        listing['market_rent'] = random.randint(5, 100)*100
    if not listing['square_feet']:
        listing['square_feet'] = random.randint(5, 75)*100
    if not listing['bedrooms']:
        listing['bedrooms'] = random.randint(1,5)
    if not listing['bathrooms']:
        listing['bathrooms'] = random.randint(1,5)
    if not listing['marketing_title']:
        listing['marketing_title'] = "Property with {0} bedrooms and {1} bathrooms".format(listing['bedrooms'], listing['bathrooms'])
    
    skip = False
    for url in listing['image_urls'].split(','):
        if url not in seen:
            seen.add(url)
        else:
           skip = True 
    
    if skip:
        continue

    newData.append(listing)

out = open('res/good-property-info.json', 'w')
out.write(json.dumps(newData))
out.close()

