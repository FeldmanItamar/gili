const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');
//const firebase = require('/workspaces/gili/node_modules/firebase/app');
//require('/workspaces/gili/node_modules/firebase/database');
const { initializeApp } = require('/workspaces/gili/node_modules/firebase/app');
const { getDatabase, ref, set, get } = require('/workspaces/gili/node_modules/firebase/database');

class Scratch3YourExtension {

    constructor (runtime) {
        import('syllable')
          .then((syllableModule) => {
            this.syllable = syllableModule.syllable;
          });

          this.runtime = runtime;

          // Your web app's Firebase configuration
          const firebaseConfig = {
            apiKey: "AIzaSyADddegGimoAk-cxU2DJvJmArf8xmg6kIo",
            authDomain: "test-b819c.firebaseapp.com",
            databaseURL: "https://test-b819c-default-rtdb.firebaseio.com",
            projectId: "test-b819c",
            storageBucket: "test-b819c.appspot.com",
            messagingSenderId: "519279386357",
            appId: "1:519279386357:web:055f161ba3e70f8fe3efbc"
          };
  
          // Initialize Firebase
        //const app = firebase.initializeApp(firebaseConfig);
        //this.database = firebase.database(app);
           // Initialize Firebase
           const app = initializeApp(firebaseConfig);
           this.database = getDatabase(app);  // Correct way to get the database instance
      }

    /**
     * Returns the metadata about your extension.
     */
    getInfo () {
        return {
            // unique ID for your extension
            id: 'yourScratchExtension',

            // name that will be displayed in the Scratch UI
            name: 'Demo',

            // colours to use for your extension blocks
            color1: '#000099',
            color2: '#660066',

            // icons to display
            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
            menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // your Scratch blocks
            blocks: [
                {
                    // name of the function where your block code lives
                    opcode: 'test1',

                    // type of block - choose from:
                    //   BlockType.REPORTER - returns a value, like "direction"
                    //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
                    //   BlockType.COMMAND - a normal command block, like "move {} steps"
                    //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: 'My first block [MY_NUMBER] and [MY_STRING]',

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [ TargetType.SPRITE, TargetType.STAGE ],

                    // arguments used in the block
                    arguments: {
                        MY_NUMBER: {
                            // default value before the user sets something
                            defaultValue: 123,

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.NUMBER
                        },
                        MY_STRING: {
                            // default value before the user sets something
                            defaultValue: 'hello',

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    // function where your code logic lives
                    opcode: 'test2',
            
                    // type of block
                    blockType: BlockType.REPORTER,
            
                    // label to display on the block
                    text: 'Title for ISBN book [BOOK_NUMBER]',
            
                    // arguments used in the block
                    arguments: {
                      BOOK_NUMBER: {
                        defaultValue: 1718500564,
            
                        // type/shape of the parameter
                        type: ArgumentType.NUMBER
                      }
                    }
                  },
                  {
                    // function where your code logic lives
                    opcode: 'test3',
            
                    // type of block
                    blockType: BlockType.REPORTER,
            
                    // label to display on the block
                    text: 'Syllables in [MY_TEXT]',
            
                    // arguments used in the block
                    arguments: {
                      MY_TEXT: {
                        defaultValue: 'Hello World',
            
                        // type/shape of the parameter
                        type: ArgumentType.STRING
                      }
                    }
                  } ,
                  {
                    opcode: 'readData',
                    blockType: BlockType.REPORTER,
                    text: 'Read data from path [DATA_PATH]',
                    arguments: {
                        DATA_PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: 'path/to/data'
                        }
                    }
                },
                {
                    opcode: 'writeData',
                    blockType: BlockType.COMMAND,
                    text: 'Write [DATA_VALUE] to path [DATA_PATH]',
                    arguments: {
                        DATA_PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: 'path/to/data'
                        },
                        DATA_VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'example data'
                        }
                    }
                }
            ]
        };
    }


    /**
     * implementation of the block with the opcode that matches this name
     *  this will be called when the block is used
     */
    test1 ({ MY_NUMBER, MY_STRING }) {
        // example implementation to return a string
        return MY_STRING + ' : doubled would be ' + (MY_NUMBER * 2);
    }
    test2 ({ BOOK_NUMBER }) {
        return fetch('https://openlibrary.org/isbn/' + BOOK_NUMBER + '.json')
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            else {
              return { title: 'Unknown' };
            }
          })
          .then((bookinfo) => {
            return bookinfo.title;
          });
      }
      test3 ({ MY_TEXT }) {
        return this.syllable(MY_TEXT);
      }
    //   readData({ DATA_PATH }) {
    //     return this.database.ref(DATA_PATH).once('value')
    //         .then(snapshot => snapshot.val() || 'No data found');
    //     }

    //     writeData({ DATA_PATH, DATA_VALUE }) {
    //     return this.database.ref(DATA_PATH).set(DATA_VALUE)
    //         .then(() => 'Data written successfully')
    //         .catch(error => `Error writing data: ${error.message}`);
    //     }

        readData({ DATA_PATH }) {
            return get(ref(this.database, DATA_PATH))
                .then(snapshot => snapshot.exists() ? snapshot.val() : 'No data found')
                .catch(error => `Error reading data: ${error.message}`);
        }
    
        writeData({ DATA_PATH, DATA_VALUE }) {
            return set(ref(this.database, DATA_PATH), DATA_VALUE)
                .then(() => 'Data written successfully')
                .catch(error => `Error writing data: ${error.message}`);
        }
    }

module.exports = Scratch3YourExtension;
