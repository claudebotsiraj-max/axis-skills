#!/bin/bash
set -e

API_KEY="3b0fc5813057e878d04fbde551651dfe47ab980f97655055e29358a844856af3"
API_BASE="https://api.postiz.com/public/v1"
IG_ID="cmlmff88c01luns0ye92rqu3o"
TT_ID="cmlmfrbbj01q2ns0yftrc3azj"

RESULTS=""

upload_and_post() {
  local FILE="$1"
  local CAPTION="$2"
  local NAME="$3"
  
  echo "=== Uploading: $NAME ($FILE) ==="
  
  # Upload the file
  UPLOAD_RESP=$(curl -s -X POST "$API_BASE/media/upload-simple" \
    -H "Authorization: $API_KEY" \
    -F "file=@$FILE")
  
  echo "Upload response: $UPLOAD_RESP"
  
  # Extract the path/URL from the response
  MEDIA_URL=$(echo "$UPLOAD_RESP" | jq -r '.path // .url // .data.path // .data.url // empty')
  
  if [ -z "$MEDIA_URL" ]; then
    echo "FAILED to upload $NAME"
    RESULTS="$RESULTS\n❌ $NAME — upload failed: $UPLOAD_RESP"
    return 1
  fi
  
  echo "Media URL: $MEDIA_URL"
  
  # Create draft post for BOTH Instagram (reel) and TikTok
  POST_BODY=$(jq -n \
    --arg content "$CAPTION" \
    --arg media "$MEDIA_URL" \
    --arg ig_id "$IG_ID" \
    --arg tt_id "$TT_ID" \
    '{
      type: "draft",
      date: "2026-03-01T12:00:00Z",
      posts: [
        {
          integrationId: $ig_id,
          content: $content,
          media: [$media],
          settings: {
            "__type": "instagram",
            "post_type": "reel"
          }
        },
        {
          integrationId: $tt_id,
          content: $content,
          media: [$media],
          settings: {
            "__type": "tiktok",
            "privacy_level": "PUBLIC_TO_EVERYONE",
            "content_posting_method": "UPLOAD"
          }
        }
      ]
    }')
  
  echo "Creating draft post..."
  POST_RESP=$(curl -s -X POST "$API_BASE/posts" \
    -H "Authorization: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "$POST_BODY")
  
  echo "Post response: $POST_RESP"
  
  # Check if successful
  POST_ID=$(echo "$POST_RESP" | jq -r '.id // .data.id // empty')
  if [ -n "$POST_ID" ]; then
    RESULTS="$RESULTS\n✅ $NAME — draft created (ID: $POST_ID)"
  else
    # Maybe different response format - try alternative post creation
    echo "Trying alternative format..."
    
    # Try simpler format with comma-separated integrations
    POST_BODY2=$(jq -n \
      --arg content "$CAPTION" \
      --arg media "$MEDIA_URL" \
      --arg ig_id "$IG_ID" \
      --arg tt_id "$TT_ID" \
      '{
        type: "draft",
        date: "2026-03-01T12:00:00Z",
        integrations: [$ig_id, $tt_id],
        posts: [
          {
            content: $content,
            image: [$media]
          }
        ],
        settings: {
          "tiktok": {
            "privacy_level": "PUBLIC_TO_EVERYONE",
            "content_posting_method": "UPLOAD"
          },
          "instagram": {
            "post_type": "reel"
          }
        }
      }')
    
    POST_RESP2=$(curl -s -X POST "$API_BASE/posts" \
      -H "Authorization: $API_KEY" \
      -H "Content-Type: application/json" \
      -d "$POST_BODY2")
    
    echo "Alt post response: $POST_RESP2"
    POST_ID2=$(echo "$POST_RESP2" | jq -r '.id // .data.id // empty')
    if [ -n "$POST_ID2" ]; then
      RESULTS="$RESULTS\n✅ $NAME — draft created (ID: $POST_ID2)"
    else
      RESULTS="$RESULTS\n⚠️ $NAME — uploaded but draft creation unclear: $POST_RESP2"
    fi
  fi
  
  echo ""
}

# Video 1
upload_and_post "liberty/liberty-summer-campaign-music.mp4" \
  "🌟 Summer Camp at Liberty Academy isn't daycare with cartwheels.

It's world-class rhythmic gymnastics training — led by a coach who's produced Olympians.

✨ Ages 3–12 | All levels welcome
📍 East Hanover, NJ
🔗 Link in bio

#RhythmicGymnastics #SummerCamp #NJMom #EastHanoverNJ #KidsActivities #GymnasticsLife" \
  "Summer Camp Launch"

# Video 2
upload_and_post "liberty/liberty-beginner-carousel-music.mp4" \
  "Your daughter doesn't need experience. She just needs to show up. ✨

Our beginner classes welcome girls ages 3-12 — no splits required.

📍 East Hanover, NJ
🔗 Link in bio

#RhythmicGymnastics #BeginnerGymnastics #NJKids #GirlPower #LibertAcademy" \
  "Beginner Classes"

# Video 3
upload_and_post "liberty/liberty-mythbuster-music.mp4" \
  "Think she needs to do the splits before joining? Think again. 🤸‍♀️

We hear this ALL the time — and it's the biggest myth in gymnastics.

Flexibility is something we BUILD together. All she needs is curiosity.

#GymnasticsMythBusted #RhythmicGymnastics #NJMom #KidsActivities" \
  "Myth Buster"

# Video 4
upload_and_post "liberty/liberty-5signs-music.mp4" \
  "Does your daughter do any of these? 👀

5 signs she'd absolutely LOVE rhythmic gymnastics:
1️⃣ Dances everywhere she goes
2️⃣ Always doing cartwheels
3️⃣ Loves ribbons & sparkly things
4️⃣ Naturally flexible
5️⃣ Thrives with structure + creativity

Sound familiar? She belongs here. ✨

#RhythmicGymnastics #NJMom #KidsActivities #SignsSheLovesGymnastics" \
  "5 Signs Your Child Would LOVE RG"

# Video 5
upload_and_post "liberty/liberty-first30min-music.mp4" \
  "Here's what her first 30 minutes at Liberty look like 🤸‍♀️

No pressure. No judgment. Just fun, movement, and discovery.

FREE trial class for new families.
📍 East Hanover, NJ

#FirstDayOfGymnastics #RhythmicGymnastics #NJKids #FreeTrialClass" \
  "First 30 Minutes at Liberty"

# Video 6
upload_and_post "liberty/liberty-pov-competition-music.mp4" \
  "POV: It's her first competition and you're trying not to cry 🥹

The confidence. The sparkle. The moment she realizes she CAN.

This is what rhythmic gymnastics does.

#ProudMom #RhythmicGymnastics #FirstCompetition #GymnasticsLife #NJMom" \
  "POV: Her First Competition"

# Video 7
upload_and_post "liberty/liberty-summer-campaign.mp4" \
  "Summer at Liberty Academy 🌞

Weekly sessions all summer | Half-day & full-day options
FREE trial class for new families
Early bird pricing available now

📍 East Hanover, NJ | Ages 3–12
DM us 'SUMMER' for details

#SummerCamp2026 #RhythmicGymnastics #NJSummerCamp #KidsActivities" \
  "Summer Camp (No Music)"

echo ""
echo "========== RESULTS =========="
echo -e "$RESULTS"
