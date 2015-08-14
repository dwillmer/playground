Phosphor Playground
===================

Source Build
------------

**Prerequisites**
- [git](http://git-scm.com/)
- [node](http://nodejs.org/)

```bash
git clone https://github.com/phosphorjs/playground.git
cd playground
npm install
npm run build
```

Build Clean
------------
```bash
npm run clean
npm run build
```

Build Examples
--------------

Follow the source build instructions first.

```bash
npm run build:examples
```

Navigate to `index.html` of the example of interest.


Supported Browsers
------------------
The browser versions which are currently *known to work* are listed below.
Earlier versions may also work, but come with no guarantees.

- Node 0.12.7+
- IE 11+
- Firefox 32+
- Chrome 38+
