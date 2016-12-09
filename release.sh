#!/usr/bin/env bash

# Assuming you have a master and dev branch, and that you make new
# release branches named as the version they correspond to, e.g. 1.0.3
# Usage: ./release.sh -v 1.0.3
# Use the -b or --bump parameter to only bump

# Default values
bump=false

# Get arguments
while [[ $# -gt 0 ]]
do
  key="$1"

case $key in
    -v|--version)
    version="$2"
    shift
    ;;
    -b|--bump)
    bump=true
    ;;
    *)
      # unknown option
    ;;
esac
shift
done

# Version must be given
if [ -z "$version" ]; then
  echo "Please specify a version with -v or --version"
  exit
fi

# Output
if [ "$bump" = true ]; then
  echo "Bumping to version $version"
else
  echo "Releasing version $version"
fi
echo "-------------------------------------------------------------------------"

# Bump only simply bumps the version on master and releases it
if [ "$bump" = true ]; then

  # Checkout master and run version script
  git checkout master
  npm version $version

  # Checkout dev branch and merge master into dev
  git checkout dev
  git merge master --no-ff --no-edit

  # Push everything to remote
  git push --all
  git push --tags

  # Done
  echo "-------------------------------------------------------------------------"
  echo "Bump to $version complete"
  exit;
fi

# Get current branch and checkout if needed
branch=$(git symbolic-ref --short -q HEAD)
if [ "$branch" != "$version" ]; then
  git checkout $version
fi

# Ensure working directory in version branch clean
git update-index -q --refresh
if ! git diff-index --quiet HEAD --; then
  echo "Working directory not clean, please commit your changes first"
  exit
fi

# Checkout master branch and merge version branch into master
git checkout master
git merge $version --no-ff --no-edit -m "$version"

# Create a version tag
git tag v$version

# Delete version branch locally and on remote
git branch -D $version
git push origin --delete $version

# Checkout dev branch and merge master into dev (to ensure we have the version)
git checkout dev
git merge master --no-ff --no-edit

# Push everything to remote
git push --all
git push --tags

# Success
echo "-------------------------------------------------------------------------"
echo "Release $version complete"
