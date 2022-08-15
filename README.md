Steps to setup this project locally:

1. Clone this repo to your desired location.

MUST HAVE:
 - Node in your local (used 14+)
 - npm installed
 - mongodb setup
 - your favorite editor to code

2. Do a `npm install` from the root directory of your project.


NOTE: Create a .env file in the root to add all the required setup in it.

Now Wait, this project uses elasticsearch hence either you should have it locally running or just connect to the PayU Elasticsearch address. But for that you should have access to it and even before know it as its
mentioned in the .env file which is now not present in the project files. :)

// things to do for Elasticsearch(ELASTICSEARCH, remember ES from now)

    --> If you have access to the PayU ES, add the address in your .env in respective ES_PAYU_URL variable and its good to go.

    --> If you dont, download ES in your local and add the address(which is mostly gonna be localhost:9200) in your .env file wrt ES_NODE_URL.


Add these as well in your .env file with respected values:

    NODE_ENV
    PORT
    SESSION_NAME
    SECRET
    MONGO_URL
    HOST


if you face linting issues, turn it off or correct it in your editor. :)





