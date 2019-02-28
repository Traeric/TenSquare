
const files = require.context('@/middleware', false, /^\.\/(?!-)[^.]+\.(js|mjs|ts)$/)
const filenames = files.keys()

function getModule(filename) {
  const file = files(filename)
  return file.default || file
}
const middleware = {}

// Generate the middleware
for (const filename of filenames) {
  const name = filename.replace(/^\.\//, '').replace(/\.(js|mjs|ts)$/, '')
  middleware[name] = getModule(filename)
}

export default middleware
