git fetch

HEADHASH=$(git rev-parse HEAD)
UPSTREAMHASH=$(git rev-parse UAT@{upstream})
if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
  echo "Pull Git"
  git pull;
else
    echo "Up-to-date";
fi
