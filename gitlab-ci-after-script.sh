UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $BASE ]; then
  git pull
fi
