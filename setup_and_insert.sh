#!/bin/bash

# === Configuration ===

# --- 1. SET MONGOSH PATH ---
MONGOSH_EXE_PATH="/c/Users/damon/tools/mongosh/mongosh-2.5.0-win32-x64/bin/mongosh.exe" # <-- VERIFY THIS PATH IS CORRECT

# --- 2. MongoDB Connection String ---
CONNECTION_STRING="mongodb+srv://gptfleetbot:LUacn6Og0C2sKum8@gptfleetbot.ci0mvno.mongodb.net/GPTHellbot?retryWrites=true&w=majority&appName=GPTFLEETBOT"

# --- 3. Database and Collection Names ---
DATABASE_NAME="GPTHellbot"
COLLECTION_NAME="bots" # Using plural 'bots'

# --- 4. Bot Data for Insertion/Update ---
# Define the bots and their data. Add other required fields here.
declare -A BOT_DATA # Use an associative array for structure

# Bot 1: GPT NETWORK
BOT_DATA["GPT NETWORK,id"]="1226012670009020467"
BOT_DATA["GPT NETWORK,identifier"]="gpt-network-v1" # EXAMPLE - CHANGE IF NEEDED
BOT_DATA["GPT NETWORK,subject"]="Application for GPT NETWORK Bot" # EXAMPLE
BOT_DATA["GPT NETWORK,body"]="I would like to apply to use the GPT NETWORK Bot on my server." # EXAMPLE
BOT_DATA["GPT NETWORK,description"]="Manages network-related tasks." # EXAMPLE
# Add other fields with defaults if desired (iconUrl, videoUrl, serverCount=0, order=0)

# Bot 2: GPT STAT BOT
BOT_DATA["GPT STAT BOT,id"]="1252450478650822677"
BOT_DATA["GPT STAT BOT,identifier"]="gpt-stat-bot-v1" # EXAMPLE - CHANGE IF NEEDED
BOT_DATA["GPT STAT BOT,subject"]="Application for GPT STAT BOT" # EXAMPLE
BOT_DATA["GPT STAT BOT,body"]="I would like to apply to use the GPT STAT BOT on my server." # EXAMPLE
BOT_DATA["GPT STAT BOT,description"]="Provides statistics." # EXAMPLE
# Add other fields with defaults if desired

# --- 5. Construct MongoDB Commands ---
MONGO_COMMANDS="" # Initialize empty command string

for bot_name in "GPT NETWORK" "GPT STAT BOT"; do
    # Retrieve data for the current bot
    discord_id="${BOT_DATA["$bot_name,id"]}"
    identifier="${BOT_DATA["$bot_name,identifier"]:-"default-$bot_name-id"}" # Default if not set
    subject="${BOT_DATA["$bot_name,subject"]:-"Default Subject for $bot_name"}"
    body="${BOT_DATA["$bot_name,body"]:-"Default Body for $bot_name"}"
    description="${BOT_DATA["$bot_name,description"]:-"Default description"}"
    # Add retrieves for other fields if you set them above

    # Construct the updateOne command with $set and $setOnInsert
    # $set runs on both update and insert (for discordClientId)
    # $setOnInsert runs ONLY when inserting a new document
    MONGO_COMMANDS+="db.${COLLECTION_NAME}.updateOne("
    MONGO_COMMANDS+=" { name: '$bot_name' }," # Filter by name
    MONGO_COMMANDS+=" { \$set: { discordClientId: '$discord_id' }," # Always set/update the ID
    MONGO_COMMANDS+="   \$setOnInsert: { botIdentifier: '$identifier'," # Set these only on insert
    MONGO_COMMANDS+="                   applyEmailSubject: '$subject',"
    MONGO_COMMANDS+="                   applyEmailBody: '$body',"
    MONGO_COMMANDS+="                   description: '$description',"
    MONGO_COMMANDS+="                   serverCount: 0," # Default value on insert
    MONGO_COMMANDS+="                   order: 0 } }," # Default value on insert
    MONGO_COMMANDS+=" { upsert: true }" # Option to insert if not found
    MONGO_COMMANDS+="); " # Separator for next command
done

# Remove trailing separator
MONGO_COMMANDS=${MONGO_COMMANDS%; }

# === Script Execution ===
echo "--- Starting MongoDB Bot Document Insertion/Update ---"
echo "Target DB/Collection: ${DATABASE_NAME}/${COLLECTION_NAME}"
echo "Using mongosh at: $MONGOSH_EXE_PATH"
echo "Operation: updateOne with { upsert: true }, \$set, and \$setOnInsert"
echo "-----------------------------------------------------"

# Verify the specified mongosh path exists
if [[ ! -f "$MONGOSH_EXE_PATH" ]]; then
    echo "ERROR: mongosh executable not found at '$MONGOSH_EXE_PATH'"
    exit 1
fi

# Execute the mongosh command
echo "[Step 1/2] Executing MongoDB upsert commands..."
# DEBUG: Uncomment the next line to see the exact commands being run
# echo "Executing: $MONGO_COMMANDS"
"$MONGOSH_EXE_PATH" "$CONNECTION_STRING" --eval "$MONGO_COMMANDS"

# Check the exit status of the command
MONGO_UPSERT_EXIT_CODE=$?
if [ $MONGO_UPSERT_EXIT_CODE -ne 0 ]; then
    echo "-----------------------------------------------------"
    echo "ERROR: Upsert command exited with status $MONGO_UPSERT_EXIT_CODE."
    echo "Operation failed."
    echo "-----------------------------------------------------"
    exit $MONGO_UPSERT_EXIT_CODE
else
    echo "Upsert command sent successfully (Exit Code: 0)."
    echo "(Check output: upsertedCount > 0 means documents were inserted with default fields,"
    echo " modifiedCount > 0 means existing documents were updated)."
fi
echo "-----------------------------------------------------"

# === Verification (Optional but recommended) ===

# --- MongoDB Find Command (for verification) ---
MONGO_FIND_COMMAND="db.${COLLECTION_NAME}.find({ name: { \$in: ['GPT NETWORK', 'GPT STAT BOT'] } }).toArray()" # Find full docs

echo "[Step 2/2] Executing MongoDB find command for verification..."
FIND_OUTPUT=$("$MONGOSH_EXE_PATH" "$CONNECTION_STRING" --quiet --eval "$MONGO_FIND_COMMAND" 2>&1)
MONGO_FIND_EXIT_CODE=$?

if [ $MONGO_FIND_EXIT_CODE -ne 0 ]; then
    echo "-----------------------------------------------------"
    echo "ERROR: Find command exited with status $MONGO_FIND_EXIT_CODE."
    echo "Verification failed."
    echo "Output from find command:"
    echo "$FIND_OUTPUT"
    echo "-----------------------------------------------------"
    exit $MONGO_FIND_EXIT_CODE
fi
if [[ ! "$FIND_OUTPUT" =~ ^\[ ]]; then
    echo "-----------------------------------------------------"
    echo "ERROR: Output from find command does not look like valid JSON."
    echo "Verification failed. Output:"
    echo "$FIND_OUTPUT"
    echo "-----------------------------------------------------"
    exit 1
fi
echo "Find command executed successfully. Displaying results:"
echo "-----------------------------------------------------"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "WARNING: 'jq' command not found. Cannot pretty-print results."
    echo "$FIND_OUTPUT" # Print raw output
else
    echo "$FIND_OUTPUT" | jq '.' # Pretty-print JSON results using jq
fi

echo "-----------------------------------------------------"
echo "Verification complete. Check the documents above."
echo "-----------------------------------------------------"

exit 0