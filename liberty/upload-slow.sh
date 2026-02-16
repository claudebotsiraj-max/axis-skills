#!/bin/bash

API_KEY="3b0fc5813057e878d04fbde551651dfe47ab980f97655055e29358a844856af3"
API_BASE="https://api.postiz.com/public/v1"
IG_ID="cmlmff88c01luns0ye92rqu3o"
TT_ID="cmlmra6r202jrns0yka91dor8"

FILES=(
  "liberty/liberty-summer-campaign-music.mp4"
  "liberty/liberty-beginner-carousel-music.mp4"
  "liberty/liberty-mythbuster-music.mp4"
  "liberty/liberty-5signs-music.mp4"
  "liberty/liberty-first30min-music.mp4"
  "liberty/liberty-pov-competition-music.mp4"
  "liberty/liberty-summer-campaign.mp4"
)

NAMES=(
  "Summer Camp Launch"
  "Beginner Classes"
  "Myth Buster"
  "5 Signs Your Child Would LOVE RG"
  "First 30 Minutes at Liberty"
  "POV: Her First Competition"
  "Summer Camp (No Music)"
)

CAPTIONS=(
  $'🌟 Summer Camp at Liberty Academy isn\'t daycare with cartwheels.\n\nIt\'s world-class rhythmic gymnastics training — led by a coach who\'s produced Olympians.\n\n✨ Ages 3–12 | All levels welcome\n📍 East Hanover, NJ\n🔗 Link in bio\n\n#RhythmicGymnastics #SummerCamp #NJMom #EastHanoverNJ #KidsActivities #GymnasticsLife'
  $'Your daughter doesn\'t need experience. She just needs to show up. ✨\n\nOur beginner classes welcome girls ages 3-12 — no splits required.\n\n📍 East Hanover, NJ\n🔗 Link in bio\n\n#RhythmicGymnastics #BeginnerGymnastics #NJKids #GirlPower #LibertAcademy'
  $'Think she needs to do the splits before joining? Think again. 🤸‍♀️\n\nWe hear this ALL the time — and it\'s the biggest myth in gymnastics.\n\nFlexibility is something we BUILD together. All she needs is curiosity.\n\n#GymnasticsMythBusted #RhythmicGymnastics #NJMom #KidsActivities'
  $'Does your daughter do any of these? 👀\n\n5 signs she\'d absolutely LOVE rhythmic gymnastics:\n1️⃣ Dances everywhere she goes\n2️⃣ Always doing cartwheels\n3️⃣ Loves ribbons & sparkly things\n4️⃣ Naturally flexible\n5️⃣ Thrives with structure + creativity\n\nSound familiar? She belongs here. ✨\n\n#RhythmicGymnastics #NJMom #KidsActivities #SignsSheLovesGymnastics'
  $'Here\'s what her first 30 minutes at Liberty look like 🤸‍♀️\n\nNo pressure. No judgment. Just fun, movement, and discovery.\n\nFREE trial class for new families.\n📍 East Hanover, NJ\n\n#FirstDayOfGymnastics #RhythmicGymnastics #NJKids #FreeTrialClass'
  $'POV: It\'s her first competition and you\'re trying not to cry 🥹\n\nThe confidence. The sparkle. The moment she realizes she CAN.\n\nThis is what rhythmic gymnastics does.\n\n#ProudMom #RhythmicGymnastics #FirstCompetition #GymnasticsLife #NJMom'
  $'Summer at Liberty Academy 🌞\n\nWeekly sessions all summer | Half-day & full-day options\nFREE trial class for new families\nEarly bird pricing available now\n\n📍 East Hanover, NJ | Ages 3–12\nDM us \'SUMMER\' for details\n\n#SummerCamp2026 #RhythmicGymnastics #NJSummerCamp #KidsActivities'
)

RESULTS=""
SUCCESS=0
FAIL=0

for i in "${!FILES[@]}"; do
  NAME="${NAMES[$i]}"
  FILE="${FILES[$i]}"
  CAPTION="${CAPTIONS[$i]}"
  
  echo "=== [$((i+1))/7] $NAME ==="
  
  # Upload with retry
  for attempt in 1 2 3; do
    UPLOAD_RESP=$(curl -s -X POST "$API_BASE/upload" \
      -H "Authorization: $API_KEY" \
      -F "file=@$FILE;type=video/mp4")
    
    if echo "$UPLOAD_RESP" | jq -e '.id' > /dev/null 2>&1; then
      break
    fi
    echo "Upload attempt $attempt failed: $UPLOAD_RESP"
    echo "Waiting 120s..."
    sleep 120
  done
  
  MEDIA_ID=$(echo "$UPLOAD_RESP" | jq -r '.id // empty')
  MEDIA_PATH=$(echo "$UPLOAD_RESP" | jq -r '.path // empty')
  
  if [ -z "$MEDIA_ID" ] || [ -z "$MEDIA_PATH" ]; then
    echo "FAILED upload after retries"
    RESULTS="${RESULTS}❌ $NAME — upload failed\n"
    FAIL=$((FAIL+1))
    continue
  fi
  
  echo "Uploaded: $MEDIA_PATH"
  sleep 3
  
  # Create draft
  POST_BODY=$(jq -n \
    --arg caption "$CAPTION" \
    --arg mid "$MEDIA_ID" \
    --arg mpath "$MEDIA_PATH" \
    --arg ig "$IG_ID" \
    --arg tt "$TT_ID" \
    '{
      type: "draft",
      date: "2026-03-01T12:00:00.000Z",
      shortLink: false,
      tags: [],
      posts: [
        {
          integration: {id: $ig},
          value: [{content: $caption, image: [{id: $mid, path: $mpath}]}],
          settings: {__type: "instagram", post_type: "post"}
        },
        {
          integration: {id: $tt},
          value: [{content: $caption, image: [{id: $mid, path: $mpath}]}],
          settings: {__type: "tiktok", privacy_level: "PUBLIC_TO_EVERYONE", content_posting_method: "UPLOAD", duet: false, stitch: false, comment: true, autoAddMusic: "no", brand_content_toggle: false, brand_organic_toggle: false}
        }
      ]
    }')
  
  for attempt in 1 2 3; do
    POST_RESP=$(curl -s -X POST "$API_BASE/posts" \
      -H "Authorization: $API_KEY" \
      -H "Content-Type: application/json" \
      -d "$POST_BODY")
    
    if echo "$POST_RESP" | jq -e '.[0].postId' > /dev/null 2>&1; then
      break
    fi
    echo "Post attempt $attempt failed: $POST_RESP"
    echo "Waiting 120s..."
    sleep 120
  done
  
  POST_COUNT=$(echo "$POST_RESP" | jq 'length // 0' 2>/dev/null)
  if [ "$POST_COUNT" = "2" ]; then
    IG_PID=$(echo "$POST_RESP" | jq -r '.[0].postId')
    TT_PID=$(echo "$POST_RESP" | jq -r '.[1].postId')
    echo "✅ IG: $IG_PID | TT: $TT_PID"
    RESULTS="${RESULTS}✅ $NAME — IG: $IG_PID | TT: $TT_PID\n"
    SUCCESS=$((SUCCESS+1))
  else
    echo "⚠️ $POST_RESP"
    RESULTS="${RESULTS}⚠️ $NAME — $POST_RESP\n"
    FAIL=$((FAIL+1))
  fi
  
  sleep 5
done

echo ""
echo "========== FINAL RESULTS =========="
echo -e "$RESULTS"
echo "Success: $SUCCESS / 7 | Failed: $FAIL / 7"
