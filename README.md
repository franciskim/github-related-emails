# What does it do?
This module parses emails from the GitHub public user data. The result is sorted by relevance (number of occurrences an email appears). The module returns an array and usually, the first entry would be the user's email.


# How to use

## CLI
`nodejs index.js --user franciskim`

## Module
```javascript
const getRelatedEmails = require('github-related-emails')

getRelatedEmails('franciskim')
    .then(r => {
        console.log(r)
    })
```
