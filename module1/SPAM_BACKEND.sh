#!/bin/bash

# API endpoint and headers
URL="http://159.203.7.129:3000/random-greeting"
AUTH_HEADER="Authorization: Bearer sk-fake-api-key"
CONTENT_TYPE="Content-Type: application/json"

# Request body data
DATA='{
  "model": "text-davinci-003",
  "prompt": "Hello, world!",
  "max_tokens": 50
}'

# Number of batches and requests per batch
BATCH_SIZE=10
REQUESTS_PER_BATCH=10000

# Function to send a single POST request
send_request() {
  response=$(curl -s -X POST "$URL" \
    -H "$AUTH_HEADER" \
    -H "$CONTENT_TYPE" \
    -d "$DATA")
    echo $response
}

# Loop through batches
for ((batch=1; batch<=BATCH_SIZE; batch++)); do
  echo "Starting batch $batch..."

  # Loop to send requests in the current batch
  for ((req=1; req<=REQUESTS_PER_BATCH; req++)); do
    send_request &
  done

  # Wait for all requests in the batch to complete
  wait
  echo "Batch $batch complete."

  # Optional: Delay between batches (e.g., 1 second)
  sleep 1
done

echo "All batches completed."
