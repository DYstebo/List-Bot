<p align ="center">
  <b><h1 style="font-size:32px">I'm hosting a Discord Bot running 24/7 that can be added to your servers!</h1> </b>
  <style>
    .button {
      border: none;
      color: white;
      background-color: black;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 22px;
      margin: 4px 2px;
      cursor: pointer;
    }
  </style>
  <br>
  <button type="button" onclick="window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=678422329759367178&permissions=84992&scope=bot';">Click here to add my Bot to your Servers!</button>
</p>
  

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
