echo "Switching to branch master"
git checkout master

echo "Building app..." 
npm run build

echo "Deploying files to server..."
scp -P 2222 -r build/* billy@127.0.0.1:/var/www/73.117.210.185/

echo "Done!"