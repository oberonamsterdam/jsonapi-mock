#!/usr/bin/env bash

mv build/main.js build/main.js.temp
echo "#!/usr/bin/env node" > build/main.js
cat build/main.js.temp >> build/main.js
rm build/main.js.temp
