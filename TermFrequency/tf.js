const fs = require('fs');

class TermFrequency {
  countTerms(inputData, ignoreData) {
    // Initialize frequency map object
    let frequencyMap = {};

    // Initialize ignored words list
    const ignoreList = ignoreData.split("\n");

    // Fill frequency map with words and frequencies
    inputData.map((item) => {
      const existingEntry = frequencyMap[item];
      
      // Ignore word if present in ignoreList
      const shouldIgnore = ignoreList.includes(item);

      if(shouldIgnore) {
        return;
      }

      // Increase word frequency
      if (existingEntry) {
        frequencyMap[item]++;
      }

      // Add word to frequency map
      else {
        frequencyMap[item] = 1;
      }
    });

    // Sorting from most to least frequent happens here
    let sortable = [];

    for (var word in frequencyMap) {
      sortable.push([word, frequencyMap[word]]);
    }

    sortable.sort((a, b) => {
      return b[1] - a[1];
    });

    // Remove output file if one exists
    try {
      fs.unlinkSync('output.txt');
    }
    
    catch {
      console.log('No output file to remove');
    }

    // Write to output
    sortable.map(item => {
      fs.appendFileSync('output.txt', `${item[0]}\n`);
    });
  }

  readIgnoreFile(path) {
    // Return optional file with ignored words
    try {
      const ignoreData = fs.readFileSync(path, 'utf-8');

      return ignoreData;
    }

    catch (err) {
      return null;
    }
  }

  init(inputFilePath, ignoreFilePath) {
    // Read file if one is provided, log error otherwise
    try {
      let inputData = fs.readFileSync(inputFilePath, 'utf-8');

      // Remove punctuation and split text into word list
      inputData = inputData.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, "")
      inputData = inputData.split(" ");

      // Read file of words to be ignored
      const ignoreData = this.readIgnoreFile(ignoreFilePath);

      this.countTerms(inputData, ignoreData);
    }

    catch (err) {
      console.error(err);
    }
  }
}

module.exports = TermFrequency;