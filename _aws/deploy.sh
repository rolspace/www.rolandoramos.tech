aws s3 cp ./site/dist/css/rolspace.min.css s3://bucketname/dist/css/ --cache-control "public, max-age=2800000" --content-encoding gzip

aws s3 cp ./site/dist/js/rolspace.min.js s3://bucketname/dist/js/ --cache-control "public, max-age=2800000" --content-encoding gzip

aws s3 cp ./site/dist s3://bucketname/dist/ --exclude "*" --include "*.map" --cache-control "public, max-age=2800000" --recursive

aws s3 cp ./site s3://bucketname --exclude "*" --include "*.html" --content-type "text/html; charset=utf-8" --cache-control "public, max-age=2800000" --recursive

aws s3 cp ./site s3://bucketname --exclude "*" --include "*.png" --cache-control "public, max-age=2800000" --recursive

aws s3 cp ./site s3://bucketname --exclude "*" --include "*.jpg" --cache-control "public, max-age=2800000" --recursive

aws s3 cp ./site/assets/fonts s3://bucketname/assets/fonts/ --cache-control "public, max-age=2800000" --recursive

aws s3 cp ./site/assets/fonts s3://bucketname/assets/fonts/ --exclude "*" --include "*.woff2" --content-type "application/font-woff2" --cache-control "public, max-age=2800000" --recursive

aws s3 cp ./site/about/index.html s3://bucketname/about/ --cache-control "no-cache"

aws s3 cp ./site/posts/index.html s3://bucketname/posts/ --cache-control "no-cache"

aws s3 cp ./site/page2/index.html s3://bucketname/page2/ --cache-control "no-cache"

aws s3 cp ./site/page3/index.html s3://bucketname/page3/ --cache-control "no-cache"

aws s3 cp ./site/page4/index.html s3://bucketname/page4/ --cache-control "no-cache"

aws s3 cp ./site/page5/index.html s3://bucketname/page5/ --cache-control "no-cache"

aws s3 cp ./site/feed.xml s3://bucketname --cache-control "no-cache"

aws s3 cp ./site/index.html s3://bucketname --cache-control "no-cache" --content-encoding gzip