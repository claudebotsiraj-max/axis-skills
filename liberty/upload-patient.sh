#!/bin/bash
# Patient upload script - waits for rate limit to clear, then uploads efficiently

API_KEY="3b0fc5813057e878d04fbde551651dfe47ab980f97655055e29358a844856af3"
API_BASE="https://api.postiz.com/public/v1"
IG_ID="cmlmff88c01luns0ye92rqu3o"
TT_ID="cmlmra6r202jrns0yka91dor8"
LOG="/Users/sms/.openclaw/workspace/liberty/upload-results.log"

echo "$(date): Starting patient upload process" > "$LOG"

# Wait for rate limit to clear
echo "$(date): Waiting for rate limit reset..." >> "$LOG"
while true; do
  RESP=$(curl -s "$API_BASE/integrations" -H "Authorization: $API_KEY")
  if echo "$RESP" | jq -e '.[0].id' > /dev/null 2>&1; then
    echo "$(date): Rate limit cleared!" >> "$LOG"
    break
  fi
  sleep 60
done

declare -a FILES NAMES
FILES[0]="liberty/liberty-summer-campaign-music.mp4"
FILES[1]="liberty/liberty-beginner-carousel-music.mp4"
FILES[2]="liberty/liberty-mythbuster-music.mp4"
FILES[3]="liberty/liberty-5signs-music.mp4"
FILES[4]="liberty/liberty-first30min-music.mp4"
FILES[5]="liberty/liberty-pov-competition-music.mp4"
FILES[6]="liberty/liberty-summer-campaign.mp4"

NAMES[0]="Summer Camp Launch"
NAMES[1]="Beginner Classes"
NAMES[2]="Myth Buster"
NAMES[3]="5 Signs Your Child Would LOVE RG"
NAMES[4]="First 30 Minutes at Liberty"
NAMES[5]="POV: Her First Competition"
NAMES[6]="Summer Camp (No Music)"

# Store captions in temp files to avoid quoting issues
cat > /tmp/cap0.txt << 'CAPEOF'
🌟 Summer Camp at Liberty Academy isn't daycare with cartwheels.

It's world-class rhythmic gymnastics training — led by a coach who's produced Olympians.

✨ Ages 3–12 | All levels welcome
📍 East Hanover, NJ
🔗 Link in bio

#RhythmicGymnastics #SummerCamp #NJMom #EastHanoverNJ #KidsActivities #GymnasticsLife
CAPEOF

cat > /tmp/cap1.txt << 'CAPEOF'
Your daughter doesn't need experience. She just needs to show up. ✨

Our beginner classes welcome girls ages 3-12 — no splits required.

📍 East Hanover, NJ
🔗 Link in bio

#RhythmicGymnastics #BeginnerGymnastics #NJKids #GirlPower #LibertAcademy
CAPEOF

cat > /tmp/cap2.txt << 'CAPEOF'
Think she needs to do the splits before joining? Think again. 🤸‍♀️

We hear this ALL the time — and it's the biggest myth in gymnastics.

Flexibility is something we BUILD together. All she needs is curiosity.

#GymnasticsMythBusted #RhythmicGymnastics #NJMom #KidsActivities
CAPEOF

cat > /tmp/cap3.txt << 'CAPEOF'
Does your daughter do any of these? 👀

5 signs she'd absolutely LOVE rhythmic gymnastics:
1️⃣ Dances everywhere she goes
2️⃣ Always doing cartwheels
3️⃣ Loves ribbons & sparkly things
4️⃣ Naturally flexible
5️⃣ Thrives with structure + creativity

Sound familiar? She belongs here. ✨

#RhythmicGymnastics #NJMom #KidsActivities #SignsSheLovesGymnastics
CAPEOF

cat > /tmp/cap4.txt << 'CAPEOF'
Here's what her first 30 minutes at Liberty look like 🤸‍♀️

No pressure. No judgment. Just fun, movement, and discovery.

FREE trial class for new families.
📍 East Hanover, NJ

#FirstDayOfGymnastics #RhythmicGymnastics #NJKids #FreeTrialClass
CAPEOF

cat > /tmp/cap5.txt << 'CAPEOF'
POV: It's her first competition and you're trying not to cry 🥹

The confidence. The sparkle. The moment she realizes she CAN.

This is what rhythmic gymnastics does.

#ProudMom #RhythmicGymnastics #FirstCompetition #GymnasticsLife #NJMom
CAPEOF

cat > /tmp/cap6.txt << 'CAPEOF'
Summer at Liberty Academy 🌞

Weekly sessions all summer | Half-day & full-day options
FREE trial class for new families
Early bird pricing available now

📍 East Hanover, NJ | Ages 3–12
DM us 'SUMMER' for details

#SummerCamp2026 #RhythmicGymnastics #NJSummerCamp #KidsActivities
CAPEOF

SUCCESS=0
FAIL=0
RESULTS=""

for i in 0 1 2 3 4 5 6; do
  NAME="${NAMES[$i]}"
  FILE="${FILES[$i]}"
  CAPTION=$(cat /tmp/cap${i}.txt)
  
  echo "$(date): [$((i+1))/7] $NAME - uploading..." >> "$LOG"
  
  # Upload with retry
  UPLOADED=false
  for attempt in 1 2 3; do
    UPLOAD_RESP=$(curl -s -X POST "$API_BASE/upload" \
      -H "Authorization: $API_KEY" \
      -F "file=@$FILE;type=video/mp4")
    
    MEDIA_ID=$(echo "$UPLOAD_RESP" | jq -r '.id // empty')
    MEDIA_PATH=$(echo "$UPLOAD_RESP" | jq -r '.path // empty')
    
    if [ -n "$MEDIA_ID" ] && [ -n "$MEDIA_PATH" ]; then
      UPLOADED=true
      break
    fi
    echo "$(date): Upload attempt $attempt failed, waiting 180s..." >> "$LOG"
    sleep 180
  done
  
  if [ "$UPLOADED" = false ]; then
    echo "$(date): ❌ $NAME — upload failed" >> "$LOG"
    RESULTS="${RESULTS}❌ $NAME — upload failed\n"
    FAIL=$((FAIL+1))
    continue
  fi
  
  echo "$(date): Uploaded $MEDIA_PATH" >> "$LOG"
  
  # Small delay before post creation
  sleep 5
  
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
  
  POSTED=false
  for attempt in 1 2 3; do
    POST_RESP=$(curl -s -X POST "$API_BASE/posts" \
      -H "Authorization: $API_KEY" \
      -H "Content-Type: application/json" \
      -d "$POST_BODY")
    
    if echo "$POST_RESP" | jq -e '.[0].postId' > /dev/null 2>&1; then
      POSTED=true
      break
    fi
    echo "$(date): Post attempt $attempt failed: $POST_RESP" >> "$LOG"
    sleep 180
  done
  
  if [ "$POSTED" = true ]; then
    IG_PID=$(echo "$POST_RESP" | jq -r '.[0].postId')
    TT_PID=$(echo "$POST_RESP" | jq -r '.[1].postId')
    echo "$(date): ✅ $NAME — IG: $IG_PID | TT: $TT_PID" >> "$LOG"
    RESULTS="${RESULTS}✅ $NAME — IG: $IG_PID | TT: $TT_PID\n"
    SUCCESS=$((SUCCESS+1))
  else
    echo "$(date): ⚠️ $NAME — post failed" >> "$LOG"
    RESULTS="${RESULTS}⚠️ $NAME — post creation failed\n"
    FAIL=$((FAIL+1))
  fi
  
  # Wait between videos to avoid rate limit (need ~150s between pairs of requests for 30/hr)
  if [ $i -lt 6 ]; then
    echo "$(date): Waiting 150s before next video..." >> "$LOG"
    sleep 150
  fi
done

echo "" >> "$LOG"
echo "========== FINAL RESULTS ==========" >> "$LOG"
echo -e "$RESULTS" >> "$LOG"
echo "Success: $SUCCESS / 7 | Failed: $FAIL / 7" >> "$LOG"
echo "$(date): DONE" >> "$LOG"

# Write a completion marker
echo "DONE|$SUCCESS|$FAIL" > /Users/sms/.openclaw/workspace/liberty/upload-status.txt
