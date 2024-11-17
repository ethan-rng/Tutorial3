#!/bin/bash

# API endpoint and headers
URL="http://localhost:4000/task"
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
  # Capture both the response and the HTTP status code
  response=$(curl -s -w "%{http_code}" -o temp_response.txt -X POST "$URL" \
    -H "$AUTH_HEADER" \
    -H "$CONTENT_TYPE" \
    -d "$DATA")
  
  # Extract the HTTP status code and response body
  http_status="${response: -3}"
  response_body=$(<temp_response.txt)

  # Check if the request was successful (status code 200)
  if [[ "$http_status" -eq 200 ]]; then
    echo "$response_body"
  else
    echo "false"
  fi


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
