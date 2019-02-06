#!/bin/bash

# Load up .env
set -o allexport
[[ -f .env ]] && source .env
set +o allexport

echo "Cleaning cache and building everything from scratch"
rm -fr .cache public
gatsby build

# Putting a specific robots.txt for stage environment
echo "User-agent: *" > public/robots.txt
echo "Disallow: /" >> public/robots.txt

echo "Will override everything on s3 bucket '$S3_BUCKET'."
aws s3 rm s3://$S3_BUCKET --recursive
aws s3 sync ./public s3://$S3_BUCKET --delete --cache-control max-age=86400 --acl public-read

aws s3 website s3://$S3_BUCKET --index-document index.html --error-document 404.html

