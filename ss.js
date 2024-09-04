import json

# Load the JSON data from the file
with open('/c:/Users/you4i/Coding/orders/orders.json') as file:
  data = json.load(file)

# Sort the data by date
sorted_data = dict(sorted(data.items()))

# Print the sorted data
print(json.dumps(sorted_data, indent=2))
