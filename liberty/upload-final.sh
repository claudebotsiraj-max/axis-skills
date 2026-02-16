#!/bin/bash

API_KEY="3b0fc5813057e878d04fbde551651dfe47ab980f97655055e29358a844856af3"
API_BASE="https://api.postiz.com/public/v1"
IG_ID="cmlmff88c01luns0ye92rqu3o"
TT_ID="cmlmra6r202jrns0yka91dor8"

RESULTS=""
SUCCESS=0
FAIL=0

create_draft() {
  local FILE="$1"
  local CAPTION="$2"
  local NAME="$3"
  
  echo "=== $NAME ==="
  
  # Upload
  UPLOAD_RESP=$(curl -s -X POST "$API_BASE/upload" \
    -H "Authorization: $API_KEY" \
    -F "file=@$FILE;type=video/mp4")
  
  MEDIA_ID=$(echo "$UPLOAD_RESP" | jq -r '.id // empty')
  MEDIA_PATH=$(echo "$UPLOAD_RESP" | jq -r '.path // empty')
  
  if [ -z "$MEDIA_ID" ] || [ -z "$MEDIA_PATH" ]; then
    echo "FAILED upload: $UPLOAD_RESP"
    RESULTS="${RESULTS}❌ $NAME — upload failed\n"
    FAIL=$((FAIL+1))
    return
  fi
  
  echo "Uploaded: $MEDIA_PATH (id: $MEDIA_ID)"
  
  # Build JSON with jq
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
  
  POST_RESP=$(curl -s -X POST "$API_BASE/posts" \
    -H "Authorization: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "$POST_BODY")
  
  # Check result
  POST_COUNT=$(echo "$POST_RESP" | jq 'length // 0' 2>/dev/null)
  if [ "$POST_COUNT" = "2" ]; then
    IG_PID=$(echo "$POST_RESP" | jq -r '.[0].postId')
    TT_PID=$(echo "$POST_RESP" | jq -r '.[1].postId')
    RESULTS="${RESULTS}✅ $NAME — IG: $IG_PID | TT: $TT_PID\n"
    SUCCESS=$((SUCCESS+1))
  else
    RESULTS="${RESULTS}⚠️ $NAME — response: $(echo $POST_RESP | head -c 150)\n"
    FAIL=$((FAIL+1))
  fi
  
  sleep 2
}

create_draft "liberty/liberty-summer-campaign-music.mp4" \
  $'🌟 Summer Camp at Liberty Academy isn\'t daycare with cartwheels.\n\nIt\'s world-class rhythmic gymnastics training — led by a coach who\'s produced Olympians.\n\n✨ Ages 3–12 | All levels welcome\n📍 East Hanover, NJ\n🔗 Link in bio\n\n#RhythmicGymnastics #SummerCamp #NJMom #EastHanoverNJ #KidsActivities #GymnasticsLife' \
  "Summer Camp Launch"

create_draft "liberty/liberty-beginner-carousel-music.mp4" \
  $'Your daughter doesn\'t need experience. She just needs to show up. ✨\n\nOur beginner classes welcome girls ages 3-12 — no splits required.\n\n📍 East Hanover, NJ\n🔗 Link in bio\n\n#RhythmicGymnastics #BeginnerGymnastics #NJKids #GirlPower #LibertAcademy' \
  "Beginner Classes"

create_draft "liberty/liberty-mythbuster-music.mp4" \
  $'Think she needs to do the splits before joining? Think again. 🤸‍♀️\n\nWe hear this ALL the time — and it\'s the biggest myth in gymnastics.\n\nFlexibility is something we BUILD together. All she needs is curiosity.\n\n#GymnasticsMythBusted #RhythmicGymnastics #NJMom #KidsActivities' \
  "Myth Buster"

create_draft "liberty/liberty-5signs-music.mp4" \
  $'Does your daughter do any of these? 👀\n\n5 signs she\'d absolutely LOVE rhythmic gymnastics:\n1️⃣ Dances everywhere she goes\n2️⃣ Always doing cartwheels\n3️⃣ Loves ribbons & sparkly things\n4️⃣ Naturally flexible\n5️⃣ Thrives with structure + creativity\n\nSound familiar? She belongs here. ✨\n\n#RhythmicGymnastics #NJMom #KidsActivities #SignsSheLovesGymnastics' \
  "5 Signs Your Child Would LOVE RG"

create_draft "liberty/liberty-first30min-music.mp4" \
  $'Here\'s what her first 30 minutes at Liberty look like 🤸‍♀️\n\nNo pressure. No judgment. Just fun, movement, and discovery.\n\nFREE trial class for new families.\n📍 East Hanover, NJ\n\n#FirstDayOfGymnastics #RhythmicGymnastics #NJKids #FreeTrialClass' \
  "First 30 Minutes at Liberty"

create_draft "liberty/liberty-pov-competition-music.mp4" \
  $'POV: It\'s her first competition and you\'re trying not to cry 🥹\n\nThe confidence. The sparkle. The moment she realizes she CAN.\n\nThis is what rhythmic gymnastics does.\n\n#ProudMom #RhythmicGymnastics #FirstCompetition #GymnasticsLife #NJMom' \
  "POV: Her First Competition"

create_draft "liberty/liberty-summer-campaign.mp4" \
  $'Summer at Liberty Academy 🌞\n\nWeekly sessions all summer | Half-day & full-day options\nFREE trial class for new families\nEarly bird pricing available now\n\n📍 East Hanover, NJ | Ages 3–12\nDM us \'SUMMER\' for details\n\n#SummerCamp2026 #RhythmicGymnastics #NJSummerCamp #KidsActivities' \
  "Summer Camp (No Music)"

echo ""
echo "========== RESULTS =========="
echo -e "$RESULTS"
echo "Success: $SUCCESS / 7 | Failed: $FAIL / 7"
