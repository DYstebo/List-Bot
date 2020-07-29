<button name="button" onclick="http://www.google.com">Add my Discord Bot to your Server!</button>

# List-Bot
List-Bot can randomly choose a user-specified amount of either unique or non-unique 
items from a created list. You could make a list of users to select from, a list of 
your favorite sports teams, numbers, or anything else you'd like! Use `/help` to get started!

# Commands List:
/new [List or Entries] [List name] [Entries separated by spaces, optional]

/delete [List or Entries] [List name] [Entries separated by spaces, not required if deleting a list]

/set [List name] [Entries separated by spaces, will overwrite current entries]

/list [List name, optional. Not including a list will get return all Lists]

/urandom [list] [number of unique items to return]

/nurandom [list] [number of non-unique items to return]

/getRandom [maximum] [minimum (default is 1)]

/help

/info

# To run:
Copy your bot token, and put it in the field labelled `botToken` in the `config.json` file.

Then run the batch file 'Run Lists.bat' and your bot is ready to make some lists!
