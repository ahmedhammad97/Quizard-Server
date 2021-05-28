# Quizard Server

### How to run:
- Make sure you have **node.js** (v15.2.0+) and **npm** (7.0.0+) installed
- Install dependencies using `npm install`
- Run the server using `node index.js`
- You should see a message **"Listening at port 8080"**

### Assumptions:
We assume that:
- The client (phone app) is not malicious and won't be tempered-by. Calculations that runs on the client is honest and fair
- Network delays is not accounted for. It might give a slight favor to a player over the other
- We don't account for network failures and disconnections
- All data are only memory-based with no usage of a durable data store (database). The game cannot continue without the server running anyways.
