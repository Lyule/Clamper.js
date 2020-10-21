# Clamper.js

By [vue-clamp](https://github.com/Justineo/vue-clamp).


## USAGE

```
npm i clamper.js --save
```

```
// js
import Clamper from 'clamper.js'

new Clamper({
  el: '.app',
  maxLines: 2,
  ellipsis: '...',
  toggleBtnTexts: ['expand', 'up'],
  text: 'testtesttesttesttesttesttesttesttesttesttesttest'
})

// html
<div class="app"></div>
// or
<div class="app" data-text="testtesttesttesttesttesttesttesttesttesttesttest"></div>
```

