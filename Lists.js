const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
var store = require('json-fs-store')();
client.config = config;

client.once('ready', () => {
	console.log('Ready to create lists!');
});

const prefix = config.prefix;



client.on('message', message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    //message.channel.send(`${args}`);

    const command = args.shift().toLowerCase();
    
    //message.channel.send(`${args}`);

    if (message.content.indexOf(client.config.prefix) !== 0 || message.author.id == 678422329759367178) return;

    if (command === "new") {
        // Detects insufficient number of arguments
        if (args.length < 2) {
            return message.channel.send(`The command doesn't work that way! \nUse /help to display proper command syntax!`);
        }
        listOrEntry = args.shift().toLowerCase();
        listName = args.shift();
        path = `./store/${listName}.json`;
        if (fs.existsSync(path) && listOrEntry === "list") return message.channel.send(`${listName} already exists! Try again!`);

        // Format the data to be acceptable for json-fs-store
        if (listOrEntry === "list") {
            var newList = {
                id: listName,
                entries: args
            }
            store.add(newList, function(err) {
                if (err) {
                    console.error(`Problem saving new list, ${listName}: `, err);
                    message.channel.send(`Problem creating new list, ${listName}. Try again later: `);
                    return;
                } else {
                    console.log(`Created new list, ${listName}!`);
                    if (args == null || args.length == 0) {
                        message.channel.send(`Created new list, ${listName}!`);
        
                    } else {
                        message.channel.send(`Created new list, ${listName}, with entries${generateListArray(args)}.`);
                    
                    }
                }    
            });

            //message.channel.send(`${args}`);

        }
        else if (listOrEntry === "entries") {
            if (args == null || args.length == 0) {
                message.channel.send(`Need to include at least 1 entry to add! Try again!`);
                return;

            } else {
                var newListEntries = [];
                store.load(listName, function(err, json) {
                    if (err) {
                         // JSON failed to parse
                        console.error("Problem loading json:", err);
                        return;
                    } else {
                        const newEntries = args;
                        console.log(`${newEntries}`);
                        if(json.entries.length == 0) {
                            newListEntries = newEntries;

                        } else {
                            console.log(`${newListEntries}`);
                            newListEntries = addToListArray(json.entries, args);
                            console.log(`${newListEntries}`);
                        }
                        console.log(`${newListEntries}`);
                        var newList = {
                            id: listName,
                            entries: newListEntries
                        }
                        store.add(newList, function(err) {
                            if (err) {
                                console.error(`Problem appending list, ${listName}: `, err);
                                message.channel.send(`Problem appending list, ${listName}. Try again later: `);
                                return;
                            } else {
                                console.log(`Appended list, ${listName}!`);
                                message.channel.send(`Added entries ${newEntries} to ${listName}.`);
                            }    
                        });
                    }
                });
                
            }
        } else return message.channel.send(`${prefix}new doesn't work that way! \nProper Syntax: /new [List or Entries] [List name] [Entries separated by spaces]`);

    } else if (command === "delete") {
        if (args.length < 2) {
            return message.channel.send(`The command doesn't work that way! \nUse /help to display proper command syntax!`);
        }
        listOrEntry = args.shift().toLowerCase();
        listName = args.shift();
        path = `./store/${listName}.json`;
        if(listOrEntry === "list")
        {
            store.remove(listName, function(err) {
                if (err) {
                    console.error("[ERROR] Problem removing list! Are you sure it exists? Make sure you didn't make any typos...");
                    message.channel.send("Cannot remove a list that doesn't exist!");
                } else {
                    console.log(`Successfully deleted list, ${listName}!`);
                }
            });
        } else if (listOrEntry === "entries") {
            var savedEntries = [];
            var removedEntries = [];
            if (fs.existsSync(path)) {
                store.load(listName, function(err, json) {
                    if (err) {
                        return console.log(`[ERROR] Problem parsing list: `, err);
                    } else {
                        savedEntries = json.entries.slice();
                        args.forEach(function(entry) {
                            savedEntries = savedEntries.filter(el => el.toLowerCase() != entry.toLowerCase());
                            /*
                            for (i = 0; i < savedEntries.length; i++) {
                                console.log(`${savedEntries[i]}`);
                                console.log(`${entry}`);
                                /*
                                if(entry.toLowerCase() === savedEntries[i].toLowerCase() && !!savedEntries[i]) {
                                    removedEntries.push(savedEntries[i]);
                                    console.log(removedEntries);
                                    delete savedEntries[i];
                                    console.log(`Removed ${savedEntries[i]} from ${listName}`);
                                }
                            }
                            */
                        });
                        var newList = {
                            id: listName,
                            entries: savedEntries
                        }
            
                        store.add(newList, function(err) {
                            if (err) {
                                // JSON failed to parse
                                console.error("Problem loading json:", err);
                                return;
                            } else {
                                message.channel.send(`Removed` + generateListArray(args) + ` from list, ${listName}.`);
                            }
                        });
                    }
                });
            } else {
                return message.channel.send(`Cannot delete entries to a list that doesn't exist`);
            }
        } else return message.channel.send(`${prefix}delete doesn't work that way! \nProper Syntax: /delete [List or Entries] [List name] [Entries to delete separated by spaces, not required if deleting a list]`);
        
    } else if (command === "list") {
        if (args.length < 1) {
            store.list(function(err, objects) {
                if (err) {
                    console.error("[ERROR] Problem reading file system:", err);
                    return;
                } else {
                    var Lists = [];
                    objects.forEach(function(list) {
                        Lists.push(list.id);
                    });
                    console.log(`${objects}`);
                    message.channel.send(`Current created lists are` + generateListArray(Lists) + `.`);
                }

            });
        } else if (args.length == 1) {
            listName = args.shift();
            path = `./store/${listName}.json`;
            if (fs.existsSync(path)) {
                store.load(listName, function(err, json) {
                    if (err) {
                         // JSON failed to parse
                        console.error("Problem loading json:", err);
                        return;
                    } else {
                        if (!(json.entries.length == 0 || json.entries == null)) {
                            message.channel.send(`Entries for list, ${listName}, are` + generateListArray(json.entries) + `.`);
                        } else {
                            message.channel.send(`No entries for list, ${listName}.`);
                        }
                    }
                });
            } else {
                return message.channel.send("Cannot list entries of a list that does not exist!");
            }
        } else {
            return message.channel.send("Too many arguments! Use /help to see the proper syntax for /list");
        }
    } else if (command === "set") {
        if (args.length < 2) {
            return message.channel.send(`The command doesn't work that way! \nUse /help to display proper command syntax!`);
        }
        listName = args.shift();
        path = `./store/${listName}.json`;
        if (fs.existsSync(path)) {
            var newList = {
                id: listName,
                entries: args
            }
            store.add(newList, function(err) {
                if (err) {
                    // JSON failed to parse
                    console.error("Problem loading json:", err);
                    return;
                } else {
                    message.channel.send(`Set list, ${listName}, entries to` + generateListArray(args) + '.');
                }
            });
        } else {
            return message.channel.send("Cannot set entries to a list that does not exist!");
        }
    } else if (command === "urandom") {
        listName = args.shift();
        var userRandom = Number(args.shift());
        path = `./store/${listName}.json`;
        if (fs.existsSync(path)) {
            if(Number.isInteger(userRandom)) {
                store.load(listName, function(err, json) {
                    if (err) {
                        // JSON failed to parse
                        console.error("Problem loading json:", err);
                        return;
                    } else {
                        var savedEntries = json.entries.slice();
                        var randomEntries = [];
                        if (json.entries.length < userRandom) {
                            return message.channel.send("Cannot return an amount of unique items that's larger than the amount of entries in the list. Try /nurandom if you are trying to get non-unique items");
                        } else if (userRandom < 1) {
                            return message.channel.send("Cannot return 0 or less than 1 number of items.");
                        } else {
                            for(i = 0; i < userRandom; i++) {
                                var randomNumber = Math.floor(Math.random() * (savedEntries.length - 1));
                                randomEntries[i] = savedEntries[randomNumber];
                                console.log(randomNumber);
                                savedEntries = savedEntries.filter(el => el.toLowerCase() != savedEntries[randomNumber].toLowerCase());
                            }
                            message.channel.send(`Random Entries for list ${listName} are: \n` + generateRandomArray(randomEntries));
                        }
                    }
                });
            } else {
                return message.channel.send("The third argument has to be a number!");
            }
        } else {
            return message.channel.send("Cannot get unique random entries from a list that does not exist!");
        }
    } else if (command === "nurandom") {
        listName = args.shift();
        var userRandom = Number(args.shift());
        path = `./store/${listName}.json`;
        if (fs.existsSync(path)) {
            if(Number.isInteger(userRandom)) {
                store.load(listName, function(err, json) {
                    if (err) {
                        // JSON failed to parse
                        console.error("Problem loading json:", err);
                        return;
                    } else {
                        var savedEntries = json.entries.slice();
                        var randomEntries = [];
                        if (userRandom < 1) {
                            return message.channel.send("Cannot return 0 or less than 1 number of items.");
                        } else {
                            for(i = 0; i < userRandom; i++) {
                                var randomNumber = Math.floor(Math.random() * (savedEntries.length - 1));
                                randomEntries[i] = savedEntries[randomNumber];
                                console.log(randomNumber);
                            }
                            message.channel.send(`Random Entries for list ${listName} are: \n` + generateRandomArray(randomEntries));
                        }
                    }
                });
            } else {
                return message.channel.send("The third argument has to be a number!");
            }
        } else {
            return message.channel.send("Cannot get non-unique random entries from a list that does not exist!");
        }
    } else if (command === "random") {
        if(args.length > 0) {
            var userRandomMax = Number(args.shift());
            var userRandomMin = 1;
            if(args.length == 1) {
                userRandomMin = Number(args.shift());
            } else if (args.length > 1) {
                return message.channel.send("Too many arguments! Proper syntax: /random [max] [min, optional, default is 1]");
            }
            if(Number.isInteger(userRandomMax) && Number.isInteger(userRandomMin)) {
                var randomNumber = Math.floor((Math.random() * (userRandomMax - userRandomMin)) + userRandomMin);
                message.channel.send(randomNumber);
            }

        } else {
            return message.channel.send("Include a number to be the maximum! Proper syntax: /random [max] [min, optional, default is 0]");
        }

    } else if (command === "help") {
        message.channel.send("Proper Syntax:\n               /new [List or Entries] [List name] [Entries separated by spaces, optional]\n               /delete [List or Entries] [List name] [Entries separated by spaces, not required if deleting a list]\n               /set [List name] [Entries separated by spaces, will overwrite current entries]\n               /list [List name, optional. Not including a list will get return all Lists]\n               /urandom [list] [number of unique items to return]\n               /nurandom [list] [number of non-unique items to return]\n               /getRandom [maximum] [minimum, optional (default is 1)]\n               /help\n               /info");
    
    } else if (command === "info") {
        var randomListEmbed = new Discord.MessageEmbed()
            .setColor('#00ff80')
            .setTitle('list-bot')
            .setURL('https://github.com/DYstebo/List-Bot')
            // NOTE: Can change image size if higher quality desired
            .setAuthor('Dylan Ystebo', 'https://cdn.discordapp.com/avatars/242355644013740044/565d5b10b12ba170e07c87b16d77ed75.png?size=128')
            //.setThumbnail('would need a good logo image here');
            .setDescription("List-Bot can randomly choose a user-specified amount of either unique or non-unique items from a created list. You could make a list of users to select from, a list of your favorite sports teams, or anything else you'd like! Use '/help' to get started!")
            .setTimestamp()
            .addField("Paypal", "https://paypal.me/DYstebo?locale.x=en_US");
            
        
        message.channel.send(randomListEmbed);

    } else {
        message.channel.send("I don't recognize that command. Type '/help' to get a list of commands!");
    }
});

function generateRandomArray(args) {
    var listArray = [];

    console.log("Gathering Entries...");

    for (i = 0; i < args.length; i++) {
        listArray[i] = "\n" + args[i];

    }

    return listArray;
}

function generateListArray(args) {
    //Get Entries and put them into an array
    var listArray = [];

    console.log("Gathering Entries...");

    for (i = 0; i < args.length; i++) {
        listArray[i] = " " + args[i];

    }

    return listArray;
}

function addToListArray(existingEntries, newEntries) {
    //Get existing entries, and add new entries
    var listArray = [];

    console.log("Combining Entries...");
    
    console.log(existingEntries.concat(newEntries));
    return existingEntries.concat(newEntries);
}

client.login(config.botToken);