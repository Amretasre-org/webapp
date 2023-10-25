#!/bin/bash

# Change to the directory where your Node.js application is located
cd /opt/dist

# Start your Node.js application using npm
npm run prd-start

# cd /opt/dist
# npm start &
# PID=$!      # This saves the process ID of the last background process

# # Now, you can use a delay or a script to check when your process is "ready"
# sleep 5  

# # Now you'll stop the previous process
# kill $PID

# # You should ideally check here to make sure the process has stopped
# npm start   # This starts the process again, presumably in the foreground


